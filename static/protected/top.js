$(function() {
  /***********************************************************************/
  // 現在日付を取得
  getDate();

  //現在時刻取得(画面遷移時の時刻表示用)
  let hour = getTime();
  showTime(hour);

  // １秒刻みに現在時刻を取得
  setInterval(function() {
    let nowHour = getTime();
    showTime(nowHour);
  }, 1000);

  /***********************************************************************/
  // イベント
  // 出勤ボタン押下時
  $('.syukkin').on('click', () => {
    //出勤登録情報取得
    let startTime = $('.startTime').text();

    // 同じ日に２回以上出勤登録は不可とする
    if (startTime !== '未登録') {
      alert('既に登録済です。');
      return;
    }

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
    // 出勤・退勤登録情報取得
    let startTime = $('.startTime').text();
    let endTime = $('.endTime').text();

    // 同じ日に２回以上退勤登録は不可とする
    if (endTime !== '未登録') {
      alert('既に登録済です。');
      return;
    }
    // 出勤登録せずに退勤登録は不可とする
    if (startTime === '未登録') {
      alert('出勤時刻が登録されていません。');
      return;
    }

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
  let msg = nowHour + ':' + nowMin + ':' + nowSec;
  $('.realtime').html(msg);
  return nowHour;
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
  let msg = nowYear + '/' + nowMonth + '/' + nowDay;
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

function showTime(hour) {
  if(hour >= 20 || hour <= 5) {
    $('.realtimeArea').addClass('nightColor');
  }
  else if(hour >= 6 || hour <= 11) {
    $('.realtimeArea').addClass('morningColor');
  }
  else {
    $('.realtimeArea').addClass('noonColor');
  }
}