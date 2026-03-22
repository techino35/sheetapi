/**
 * @fileoverview SheetAPI - Authentication & Authorization
 */

var SHEETAPI_AUTH = (function () {
  var PROP_API_KEY = 'SHEETAPI_API_KEY';
  var PROP_LICENSE = 'SHEETAPI_LICENSE';
  var PROP_RATE_PREFIX = 'SHEETAPI_RATE_';
  var FREE_LIMIT = 100;
  var PRO_LIMIT = 10000;

  function _today() {
    return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  function validateKey(key) {
    if (!key) return false;
    return PropertiesService.getScriptProperties().getProperty(PROP_API_KEY) === key;
  }

  function getPlan() {
    var plan = PropertiesService.getScriptProperties().getProperty(PROP_LICENSE);
    return plan === 'pro' ? 'pro' : 'free';
  }

  function checkRate(isWrite) {
    var plan = getPlan();
    var limit = plan === 'pro' ? PRO_LIMIT : FREE_LIMIT;
    if (isWrite && plan === 'free') return { ok: false, plan: plan, used: 0, limit: limit, reason: 'write_requires_pro' };
    var props = PropertiesService.getScriptProperties();
    var key = PROP_RATE_PREFIX + _today();
    var current = parseInt(props.getProperty(key) || '0', 10);
    if (current >= limit) return { ok: false, plan: plan, used: current, limit: limit, reason: 'rate_limit_exceeded' };
    props.setProperty(key, String(current + 1));
    return { ok: true, plan: plan, used: current + 1, limit: limit };
  }

  function generateApiKey() {
    var key = 'sk_' + Utilities.getUuid().replace(/-/g, '');
    PropertiesService.getScriptProperties().setProperty(PROP_API_KEY, key);
    return key;
  }

  function setLicense(plan) {
    PropertiesService.getScriptProperties().setProperty(PROP_LICENSE, plan);
  }

  function getOrCreateApiKey() {
    var existing = PropertiesService.getScriptProperties().getProperty(PROP_API_KEY);
    return existing || generateApiKey();
  }

  return { validateKey, getPlan, checkRate, generateApiKey, setLicense, getOrCreateApiKey };
})();
