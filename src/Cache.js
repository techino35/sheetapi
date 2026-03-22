/**
 * @fileoverview SheetAPI - Cache Layer (TTL: 60s)
 */

var SHEETAPI_CACHE = (function () {
  var TTL = 60;
  var PREFIX = 'sheetapi_';

  function _buildKey(params) {
    var sorted = Object.keys(params).sort().map(function (k) { return k + '=' + params[k]; }).join('&');
    return PREFIX + Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, sorted)
      .map(function (b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
  }

  function get(params) {
    return CacheService.getScriptCache().get(_buildKey(params));
  }

  function set(params, value) {
    if (value.length > 100000) return;
    CacheService.getScriptCache().put(_buildKey(params), value, TTL);
  }

  function invalidate(params) {
    CacheService.getScriptCache().remove(_buildKey(params));
  }

  return { get, set, invalidate };
})();
