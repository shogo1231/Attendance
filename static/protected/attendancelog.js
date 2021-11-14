$(function() {
  /***********************************************************************/
  // 初期設定
  init();

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

function init() {
  $.ajax('./getlogData', {
    type: 'GET',
  })
  .done(function (data) {
    // 勤怠ログテーブル作成
    data.forEach((value) =>  {
    let 出勤時刻 = value.Oct.出勤時刻;
    let 退勤時刻 = value.Oct.退勤時刻;
    let 残業時間 = value.Oct.残業時間;

    $("#articletable").append(
      $("<tr></tr>")
        .append($("<td></td>").text(出勤時刻))
        .append($("<td></td>").text(退勤時刻))
        .append($("<td></td>").text(残業時間))
      );
    });
  })
  .fail(function() {
    alert('データの取得に失敗しました。');
  })
}

function nowDate(flg = null) {
  // 現在時刻データをJSON形式に変換
  let jsonData = {from: new Date(), to: new Date()}
  // JSONは日付型変換時標準日時になるため、フォーマット指定
  let nowData = JSON.stringify(jsonData, function(key, val){
    if (key === 'from' || key === 'to') {
      return moment(new Date(val)).format('YYYY/MM/DD HH:mm:ss');
    }
    return val;	
  });

  if(flg) {
    let time = String(msgToDate) + ' 17:00:00';
    let changeToTime = new Date(Date.parse(time));
    let onTime = { onTime: changeToTime };
    dateObj = Object.assign(jsonData, onTime);
    // JSONは日付型変換時標準日時になるため、フォーマット指定
    nowData = JSON.stringify(dateObj, function(key, val){
      if (key === 'from' || key === 'to' || key === 'onTime') {
        return moment(new Date(val)).format('YYYY/MM/DD HH:mm:ss');
      }
      return val;	
    });
  }
  return nowData;
}