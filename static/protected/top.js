$(function() {
  let nowTime;
  /***********************************************************************/
  // 現在日付を取得
  getDate();

  // １秒刻みに現在時刻を取得
  setInterval(function() {
    getTime();
  }, 1000);

  /***********************************************************************/
  // イベント
  // 出勤ボタン押下時
  $('.syukkin').on('click', () => {
    $.ajax('./register/syukkin_register', {
      type: 'POST',
      data: nowDate(),
      contentType: 'application/json', // リクエストの Content-Type
    })
    .done(function (data) {
      alert(data + 'で登録しました。');
    })
    .fail(function() {
      alert('失敗しました。');
    })
    .always(function() {
      location.reload();
    })
  });

  // 退勤ボタン押下時
  $('.taikin').on('click', () => {
    $.ajax('./register/taikin_register', {
      type: 'POST',
      data: nowDate(),
      contentType: 'application/json', // リクエストの Content-Type
    })
    .done(function (data) {
      alert(data + 'で登録しました。');
    })
    .fail(function() {
      alert('失敗しました。');
    })
    .always(function() {
      location.reload();
    })
  });

});

function getTime() {
  nowTime = new Date();
  let nowHour = twoDigit( nowTime.getHours() );
  let nowMin  = twoDigit( nowTime.getMinutes() );
  let nowSec  = twoDigit( nowTime.getSeconds() );
  let msg = '現在時刻：' + nowHour + ':' + nowMin + ':' + nowSec;
  $('.realtime').html(msg);
}

function twoDigit(num) {
  let ret;
  if( num < 10 ) 
    ret = '0' + num; 
  else 
    ret = num; 
  return ret;
}

function getDate() {
  let nowDate = new Date();
  let nowYear = twoDigit( nowDate.getFullYear() );
  let nowMonth  = twoDigit( nowDate.getMonth() ) + 1;
  let nowDay  = twoDigit( nowDate.getDate() );
  let msg = '現在日付：' + nowYear + '/' + nowMonth + '/' + nowDay;
  let dayOfWeek = nowDate.getDay();
  let dayOfWeekStr = [ "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日" ][dayOfWeek] ;
  $('.realdate').html(msg + ' ' + dayOfWeekStr);
}

function nowDate() {
  // 現在時刻データをJSON形式に変換
  let jsonData = {from: new Date(), to: new Date()}
  // JSONは日付型変換時標準日時になるため、フォーマット指定
  let nowData = JSON.stringify(jsonData, function(key, val){
    if (key === "from" || key === "to") {
      return moment(new Date(val)).format('YYYY/MM/DD HH:mm:ss');
    }
    return val;	
  });
  return nowData;
}
