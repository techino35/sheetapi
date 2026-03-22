/**
 * @fileoverview SheetAPI - Entry Point
 * doGet / doPost entry points. Routes to SHEETAPI_ROUTER.
 */

function doGet(e) {
  try {
    return _addCorsHeaders(SHEETAPI_ROUTER.routeGet(e));
  } catch (err) {
    return _addCorsHeaders(
      ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Internal server error: ' + err.message }))
        .setMimeType(ContentService.MimeType.JSON)
    );
  }
}

function doPost(e) {
  try {
    return _addCorsHeaders(SHEETAPI_ROUTER.routePost(e));
  } catch (err) {
    return _addCorsHeaders(
      ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Internal server error: ' + err.message }))
        .setMimeType(ContentService.MimeType.JSON)
    );
  }
}

function _addCorsHeaders(response) {
  return response;
}

function onOpen() {
  SHEETAPI_LICENSE.onOpen();
}

function showSidebar() {
  SHEETAPI_LICENSE.showSidebar();
}

function getSettings() {
  return SHEETAPI_LICENSE.getSettings();
}

function regenerateApiKey() {
  return SHEETAPI_LICENSE.regenerateApiKey();
}

function activatePro(licenseKey) {
  return SHEETAPI_LICENSE.activatePro(licenseKey);
}

function openDocs() {
  SHEETAPI_LICENSE.openDocs();
}
