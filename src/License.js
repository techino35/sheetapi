/**
 * @fileoverview SheetAPI - License & Sidebar Management
 */

var SHEETAPI_LICENSE = (function () {
  function showSidebar() {
    var html = HtmlService.createHtmlOutputFromFile('Sidebar').setTitle('SheetAPI Settings').setWidth(300);
    SpreadsheetApp.getUi().showSidebar(html);
  }

  function getSettings() {
    return { apiKey: SHEETAPI_AUTH.getOrCreateApiKey(), plan: SHEETAPI_AUTH.getPlan() };
  }

  function regenerateApiKey() {
    return SHEETAPI_AUTH.generateApiKey();
  }

  function activatePro(licenseKey) {
    if (licenseKey && licenseKey.startsWith('SHEETAPI_PRO_')) {
      SHEETAPI_AUTH.setLicense('pro');
      PropertiesService.getScriptProperties().setProperty('SHEETAPI_LICENSE_KEY', licenseKey);
      return { success: true, message: 'Pro plan activated successfully.' };
    }
    return { success: false, message: 'Invalid license key.' };
  }

  function onOpen() {
    SpreadsheetApp.getUi().createMenu('SheetAPI')
      .addItem('Open Settings', 'showSidebar')
      .addItem('View Docs', 'openDocs')
      .addToUi();
  }

  function openDocs() {
    var url = ScriptApp.getService().getUrl() + '?action=docs';
    var html = HtmlService.createHtmlOutput('<script>window.open("' + url + '"); google.script.host.close();<\/script>');
    SpreadsheetApp.getUi().showModalDialog(html, 'Opening Docs...');
  }

  return { showSidebar, getSettings, regenerateApiKey, activatePro, onOpen, openDocs };
})();
