/**
 * @fileoverview SheetAPI - Sheet Write Operations (Pro only)
 */

var SHEETAPI_WRITER = (function () {
  function create(sheetName, data) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);
    var lastCol = sheet.getLastColumn();
    if (lastCol < 1) throw new Error('Sheet has no headers: ' + sheetName);
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
    var rowData = headers.map(function (header) { return header && data[header] !== undefined ? data[header] : ''; });
    sheet.appendRow(rowData);
    var newRow = sheet.getLastRow();
    return { success: true, row: newRow, data: _rowToObject(headers, rowData, newRow) };
  }

  function update(sheetName, rowNumber, data) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);
    var row = parseInt(rowNumber, 10);
    if (isNaN(row) || row < 2) throw new Error('Invalid row number. Must be 2 or greater.');
    var lastRow = sheet.getLastRow();
    if (row > lastRow) throw new Error('Row ' + row + ' does not exist.');
    var lastCol = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
    var currentRow = sheet.getRange(row, 1, 1, lastCol).getValues()[0];
    headers.forEach(function (header, idx) { if (header && data[header] !== undefined) currentRow[idx] = data[header]; });
    sheet.getRange(row, 1, 1, lastCol).setValues([currentRow]);
    return { success: true, row: row, data: _rowToObject(headers, currentRow, row) };
  }

  function remove(sheetName, rowNumber) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);
    var row = parseInt(rowNumber, 10);
    if (isNaN(row) || row < 2) throw new Error('Invalid row number.');
    if (row > sheet.getLastRow()) throw new Error('Row ' + row + ' does not exist.');
    sheet.deleteRow(row);
    return { success: true, row: row };
  }

  function _rowToObject(headers, values, rowNum) {
    var obj = { _row: rowNum };
    headers.forEach(function (header, idx) {
      if (header) { var val = values[idx]; obj[header] = val instanceof Date ? val.toISOString() : val; }
    });
    return obj;
  }

  return { create, update, remove };
})();
