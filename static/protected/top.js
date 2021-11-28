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

    let flg = 'taikin';
    $.ajax('./register/taikin_register', {
      type: 'POST',
      data: nowDate(flg),
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
  let msgToTime = nowHour + ':' + nowMin + ':' + nowSec;
  $('.realtime').html(msgToTime);
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

let msgToDate = '';

function getDate() {
  let nowDate = new Date();
  let nowYear = twoDigit( nowDate.getFullYear() );
  let nowMonth  = twoDigit( nowDate.getMonth() ) + 1;
  let nowDay  = twoDigit( nowDate.getDate() );
  msgToDate = nowYear + '/' + nowMonth + '/' + nowDay;
  let dayOfWeek = nowDate.getDay();
  let dayOfWeekStr = [ "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日" ][dayOfWeek] ;
  $('.realdate').html(msgToDate + ' ' + dayOfWeekStr);
}

function nowDate(flg = null) {
  // 現在時刻データをJSON形式に変換
  let jsonData = {
    from: moment().tz("Asia/Tokyo").format('YYYY/MM/DD HH:mm:ss')
  };
  let nowData = JSON.stringify(jsonData);

  if(flg) {
    // 定時（１７時）の設定
    let onTime = { 
      onTime: moment().tz("Asia/Tokyo").format('YYYY/MM/DD 17:00:00')
    };
    dateObj = Object.assign(jsonData, onTime);
    nowData = JSON.stringify(dateObj);
  }
  return nowData;
}

function showTime(hour) {
  if(hour >= 6 && hour <= 11) {
    $('.realtimeArea').removeClass('nightColor');
    $('.realtimeArea').addClass('morningColor');
  }
  else if(hour >= 12 && hour <= 19) {
    $('.realtimeArea').removeClass('morningColor');
    $('.realtimeArea').addClass('noonColor');
  }
  else {
    $('.realtimeArea').removeClass('noonColor');
    $('.realtimeArea').addClass('nightColor');
  }
}