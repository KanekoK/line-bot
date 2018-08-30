var ACCESS_TOKEN = ''; // LINE アクセストークン

function getData() {
  var spreadsheet = SpreadsheetApp.openById(''); // スプレッドシートID
  var sheet = spreadsheet.getActiveSheet();
  var values = sheet.getDataRange().getValues();
  var data = {};
  for (var i = 1, l = values.length; i < l; i++) {
    var key = values[i].shift();

    if (key.length > 0) {
      data[key] = values[i];
    }
  }

  return data;
}


function reply(getMessage, data) {
  if (data[getMessage]) {
    reply_txt = data[getMessage][0];
  } else {
    reply_txt = getMessage;
  }
  return reply_txt;
}

function doPost(e) {
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  var getMessage = JSON.parse(e.postData.contents).events[0].message.text;
  data = getData();
  getMessage = reply(getMessage, data);
  
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/reply';
  
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': getMessage,
      }],
    }),
    });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}