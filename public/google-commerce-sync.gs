/**
 * WhatsApp Commerce Hub — Google Sheets and Forms bridge
 *
 * 1. Open Extensions > Apps Script from your operations Sheet.
 * 2. Replace the editor contents with this file.
 * 3. Update APP_URL and SHARED_SECRET below, then run configure().
 * 4. Deploy > New deployment > Web app. Execute as you; allow anyone with the URL.
 * 5. Paste the deployment /exec URL into Google Tools in the dashboard.
 */

function configure() {
  var APP_URL = 'https://your-commerce-domain.example';
  var SHARED_SECRET = 'replace-with-the-same-long-secret-used-in-the-dashboard';
  PropertiesService.getScriptProperties().setProperties({
    COMMERCE_APP_URL: APP_URL.replace(/\/$/, ''),
    COMMERCE_SHARED_SECRET: SHARED_SECRET
  });
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    assertSecret_(body.secret);
    if (body.action === 'ping') return json_({ ok: true });
    if (body.action !== 'replace_data') throw new Error('Unknown action');

    var spreadsheet = SpreadsheetApp.openById(body.spreadsheetId);
    replaceSheet_(spreadsheet, 'Catalog', body.data.products || []);
    replaceSheet_(spreadsheet, 'Orders', body.data.orders || []);
    replaceSheet_(spreadsheet, 'Payments', body.data.payments || []);
    return json_({ ok: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message || error) });
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Commerce Hub')
    .addItem('Send catalog to dashboard', 'pushCatalogToCommerce')
    .addItem('Install product form trigger', 'installProductFormTrigger')
    .addToUi();
}

function pushCatalogToCommerce() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Catalog');
  if (!sheet) throw new Error('The Catalog tab does not exist yet. Run a dashboard sync first.');
  var rows = objectsFromSheet_(sheet);
  postToCommerce_({ action: 'import_products', eventId: Utilities.getUuid(), rows: rows });
  SpreadsheetApp.getActive().toast(rows.length + ' product rows sent to the dashboard.', 'Catalog sync');
}

function installProductFormTrigger() {
  var spreadsheet = SpreadsheetApp.getActive();
  ScriptApp.getProjectTriggers()
    .filter(function(trigger) { return trigger.getHandlerFunction() === 'onProductFormSubmit'; })
    .forEach(function(trigger) { ScriptApp.deleteTrigger(trigger); });
  ScriptApp.newTrigger('onProductFormSubmit').forSpreadsheet(spreadsheet).onFormSubmit().create();
  spreadsheet.toast('Product form trigger installed.', 'Google Forms');
}

function onProductFormSubmit(e) {
  var named = (e && e.namedValues) || {};
  function field(name) {
    var key = Object.keys(named).filter(function(item) { return item.toLowerCase() === name.toLowerCase(); })[0];
    return key ? String(named[key][0] || '') : '';
  }
  postToCommerce_({
    action: 'product_form_submission',
    eventId: Utilities.getUuid(),
    product: {
      id: field('ID'), name: field('Name'), subtitle: field('Subtitle'), category: field('Category'),
      price: field('Price'), stock: field('Stock'), available: field('Available'), emoji: field('Emoji')
    }
  });
}

function postToCommerce_(payload) {
  var properties = PropertiesService.getScriptProperties();
  var appUrl = properties.getProperty('COMMERCE_APP_URL');
  var secret = properties.getProperty('COMMERCE_SHARED_SECRET');
  if (!appUrl || !secret) throw new Error('Run configure() first.');
  var response = UrlFetchApp.fetch(appUrl + '/api/integrations/google/webhook', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { 'X-Commerce-Integration-Secret': secret }, payload: JSON.stringify(payload)
  });
  var result = JSON.parse(response.getContentText() || '{}');
  if (response.getResponseCode() >= 300 || !result.ok) throw new Error(result.error || 'Commerce sync failed');
  return result;
}

function replaceSheet_(spreadsheet, name, rows) {
  var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.clearContents();
  if (!rows.length) {
    sheet.getRange(1, 1).setValue('No ' + name.toLowerCase() + ' yet');
    return;
  }
  var headers = Object.keys(rows[0]);
  var values = rows.map(function(row) { return headers.map(function(header) { return row[header] == null ? '' : row[header]; }); });
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#073f36').setFontColor('#ffffff');
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  sheet.setFrozenRows(1);
  sheet.getDataRange().createFilter();
  sheet.autoResizeColumns(1, headers.length);
}

function objectsFromSheet_(sheet) {
  var values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  var headers = values[0].map(function(value) { return String(value).trim(); });
  return values.slice(1).filter(function(row) { return row.some(String); }).map(function(row, index) {
    var object = { rowNumber: index + 2 };
    headers.forEach(function(header, column) { object[header] = row[column]; });
    return object;
  });
}

function assertSecret_(provided) {
  var expected = PropertiesService.getScriptProperties().getProperty('COMMERCE_SHARED_SECRET');
  if (!expected || provided !== expected) throw new Error('Unauthorized');
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
