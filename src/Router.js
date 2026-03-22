/**
 * @fileoverview SheetAPI - Request Router
 */

var SHEETAPI_ROUTER = (function () {
  function _ok(payload) {
    return ContentService.createTextOutput(JSON.stringify(Object.assign({ ok: true }, payload))).setMimeType(ContentService.MimeType.JSON);
  }

  function _error(message, code) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: message, code: code || 400 })).setMimeType(ContentService.MimeType.JSON);
  }

  function routeGet(e) {
    var params = e.parameter || {};
    var action = params.action || 'read';

    if (action === 'docs') return HtmlService.createHtmlOutput(SHEETAPI_DOCS.generate()).setTitle('SheetAPI Documentation');

    if (!SHEETAPI_AUTH.validateKey(params.key)) return _error('Invalid or missing API key.', 401);

    var rate = SHEETAPI_AUTH.checkRate(false);
    if (!rate.ok) return _error('Rate limit exceeded (' + rate.used + '/' + rate.limit + '). ' + (rate.reason === 'rate_limit_exceeded' ? 'Upgrade to Pro.' : rate.reason), 429);

    if (action !== 'read') return _error('Unknown action: ' + action, 400);

    var sheetName = params.sheet;
    if (!sheetName) return _error('Missing required parameter: sheet', 400);

    var reserved = { key: 1, action: 1, sheet: 1, limit: 1, offset: 1 };
    var filters = {};
    Object.keys(params).forEach(function (k) { if (!reserved[k]) filters[k] = params[k]; });

    var cacheKey = Object.assign({}, params);
    delete cacheKey.key;
    var cached = SHEETAPI_CACHE.get(cacheKey);
    if (cached) return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);

    try {
      var result = SHEETAPI_READER.read(sheetName, filters, params.limit, params.offset);
      var json = JSON.stringify({ ok: true, data: result.data, total: result.total, limit: result.limit, offset: result.offset });
      SHEETAPI_CACHE.set(cacheKey, json);
      return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return _error(err.message, 404);
    }
  }

  function routePost(e) {
    var params = e.parameter || {};
    var action = params.action;

    if (!SHEETAPI_AUTH.validateKey(params.key)) return _error('Invalid or missing API key.', 401);

    var rate = SHEETAPI_AUTH.checkRate(true);
    if (!rate.ok) {
      if (rate.reason === 'write_requires_pro') return _error('Write operations require Pro plan.', 403);
      return _error('Rate limit exceeded.', 429);
    }

    var body = {};
    try { if (e.postData && e.postData.contents) body = JSON.parse(e.postData.contents); }
    catch (parseErr) { return _error('Invalid JSON body: ' + parseErr.message, 400); }

    var sheetName = params.sheet;
    if (!sheetName) return _error('Missing required parameter: sheet', 400);

    try {
      if (action === 'create') { var created = SHEETAPI_WRITER.create(sheetName, body); SHEETAPI_CACHE.invalidate({ action: 'read', sheet: sheetName }); return _ok(created); }
      if (action === 'update') { var rowNum = params.row; if (!rowNum) return _error('Missing required parameter: row', 400); var updated = SHEETAPI_WRITER.update(sheetName, rowNum, body); SHEETAPI_CACHE.invalidate({ action: 'read', sheet: sheetName }); return _ok(updated); }
      if (action === 'delete') { var delRow = params.row; if (!delRow) return _error('Missing required parameter: row', 400); var deleted = SHEETAPI_WRITER.remove(sheetName, delRow); SHEETAPI_CACHE.invalidate({ action: 'read', sheet: sheetName }); return _ok(deleted); }
      return _error('Unknown action: ' + action, 400);
    } catch (err) {
      return _error(err.message, 400);
    }
  }

  return { routeGet, routePost };
})();
