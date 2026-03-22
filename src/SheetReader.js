/**
 * @fileoverview SheetAPI - Sheet Read Operations
 */

var SHEETAPI_READER = (function () {
  function read(sheetName, filters, limit, offset) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);

    var lastRow = sheet.getLastRow(), lastCol = sheet.getLastColumn();
    if (lastRow < 1 || lastCol < 1) return { data: [], total: 0, limit: limit, offset: offset };

    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
    if (lastRow < 2) return { data: [], total: 0, limit: limit, offset: offset };

    var rawRows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    var rows = rawRows.map(function (row, idx) {
      var obj = { _row: idx + 2 };
      headers.forEach(function (header, colIdx) {
        if (header) {
          var val = row[colIdx];
          obj[header] = val instanceof Date ? val.toISOString() : val;
        }
      });
      return obj;
    });

    if (filters && Object.keys(filters).length > 0) {
      rows = rows.filter(function (row) {
        return Object.keys(filters).every(function (key) {
          if (key === '_row') return true;
          return String(row[key] !== undefined ? row[key] : '').toLowerCase() === String(filters[key]).toLowerCase();
        });
      });
    }

    var total = rows.length;
    var off = parseInt(offset, 10) || 0;
    var lim = parseInt(limit, 10) || 0;
    if (off > 0) rows = rows.slice(off);
    if (lim > 0) rows = rows.slice(0, lim);

    return { data: rows, total: total, limit: lim, offset: off };
  }

  function listSheets() {
    return SpreadsheetApp.getActiveSpreadsheet().getSheets().map(function (s) { return s.getName(); });
  }

  function getHeaders(sheetName) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastColumn() < 1) return [];
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(function (h) { return String(h).trim(); }).filter(function (h) { return h; });
  }

  return { read, listSheets, getHeaders };
})();
