/**
 * @fileoverview SheetAPI - Auto Documentation Generator
 */

var SHEETAPI_DOCS = (function () {
  function generate() {
    var baseUrl = ScriptApp.getService().getUrl();
    var sheets = SHEETAPI_READER.listSheets();
    var plan = SHEETAPI_AUTH.getPlan();
    var endpoints = sheets.map(function (s) { return _buildEndpointDocs(s, SHEETAPI_READER.getHeaders(s), baseUrl, plan); });
    return _buildHtml(endpoints, baseUrl, plan);
  }

  function _buildEndpointDocs(sheetName, headers, baseUrl, plan) {
    var filterExample = headers.length > 0 ? '&amp;' + headers[0] + '=value' : '';
    var proNote = plan === 'free' ? '<span class="badge badge-free">Free</span>' : '<span class="badge badge-pro">Pro</span>';
    return [
      '<section class="sheet-docs">',
      '<h2>' + _escape(sheetName) + '</h2>',
      '<p class="columns">Columns: <code>' + headers.map(_escape).join(', ') + '</code></p>',
      '<div class="endpoint"><span class="method get">GET</span><code>' + _escape(baseUrl) + '?key=YOUR_KEY&amp;action=read&amp;sheet=' + _escape(sheetName) + '</code><p>Returns all rows.</p></div>',
      '<div class="endpoint"><span class="method get">GET</span><code>' + _escape(baseUrl) + '?key=YOUR_KEY&amp;action=read&amp;sheet=' + _escape(sheetName) + filterExample + '</code><p>Filter by column value.</p></div>',
      '<div class="endpoint"><span class="method get">GET</span><code>' + _escape(baseUrl) + '?key=YOUR_KEY&amp;action=read&amp;sheet=' + _escape(sheetName) + '&amp;limit=10&amp;offset=0</code><p>Paginate results.</p></div>',
      '<div class="endpoint"><span class="method post">POST</span><code>' + _escape(baseUrl) + '?key=YOUR_KEY&amp;action=create&amp;sheet=' + _escape(sheetName) + '</code>' + proNote + '<p>Add row.</p></div>',
      '<div class="endpoint"><span class="method post">POST</span><code>' + _escape(baseUrl) + '?key=YOUR_KEY&amp;action=update&amp;sheet=' + _escape(sheetName) + '&amp;row=2</code>' + proNote + '<p>Update row.</p></div>',
      '<div class="endpoint"><span class="method post">POST</span><code>' + _escape(baseUrl) + '?key=YOUR_KEY&amp;action=delete&amp;sheet=' + _escape(sheetName) + '&amp;row=2</code>' + proNote + '<p>Delete row.</p></div>',
      '</section>'
    ].join('\n');
  }

  function _buildHtml(endpointHtmlArr, baseUrl, plan) {
    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>SheetAPI Documentation</title><style>body{font-family:system-ui,sans-serif;max-width:900px;margin:0 auto;padding:20px;color:#333}h1{color:#1a73e8}h2{border-bottom:2px solid #e8f0fe;padding-bottom:8px;color:#1a73e8}.endpoint{background:#f8f9fa;border-left:4px solid #1a73e8;margin:12px 0;padding:12px 16px;border-radius:0 8px 8px 0}.method{display:inline-block;padding:2px 8px;border-radius:4px;font-weight:bold;font-size:12px;margin-right:8px}.get{background:#e8f5e9;color:#2e7d32}.post{background:#fff3e0;color:#e65100}code{background:#e8eaed;padding:2px 6px;border-radius:4px;font-size:13px}.badge{display:inline-block;padding:1px 6px;border-radius:10px;font-size:11px;font-weight:bold}.badge-free{background:#fce4ec;color:#c62828}.badge-pro{background:#e8f5e9;color:#1b5e20}.plan-banner{background:#e8f0fe;padding:12px;border-radius:8px;margin-bottom:20px}</style></head><body><h1>SheetAPI Documentation</h1><div class="plan-banner">Plan: <strong>' + plan.toUpperCase() + '</strong> | Base URL: <code>' + _escape(baseUrl) + '</code></div>' + endpointHtmlArr.join('\n') + '</body></html>';
  }

  function _escape(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { generate };
})();
