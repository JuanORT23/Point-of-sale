function doGet(e) {
  try {
    var resource = e.parameter.resource;
    if (!resource) {
      return createResponse({ success: false, message: "Falta resource" });
    }
    return getSheetData(resource);
  } catch (error) {
    return createResponse({ success: false, message: error.message });
  }
}

function doPost(e) {
  try {
    var resource = e.parameter.resource;
    if (!resource) {
      return createResponse({ success: false, message: "Falta resource" });
    }
    var data = JSON.parse(e.postData.contents);
    return saveData(resource, data);
  } catch (error) {
    return createResponse({ success: false, message: error.message });
  }
}

function getSheetData(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var data = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i][j];
    }
    data.push(row);
  }
  return createResponse({ success: true, data: data });
}

function saveData(sheetName, data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var headers = sheet.getDataRange().getValues()[0];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    var value = data[key];
    if (Array.isArray(value) || typeof value === "object") {
      row.push(JSON.stringify(value));
    } else {
      row.push(value || "");
    }
  }
  sheet.appendRow(row);
  return createResponse({ success: true });
}

function createResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}