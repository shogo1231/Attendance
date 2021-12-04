// 共通変数
let month;
let initVal = false;

$(function() {
  /***********************************************************************/ 
  // 初期設定
  init();

  /***********************************************************************/
  // イベント
  // 前月ボタン押下時
  $('.lastMonth').on('click', () => {
    // 変数monthを更新し、取得するログの月を決める
    month = String(Number(month) - 1);

    $.ajax('./getlogData?month=' + month, {
      type: 'GET',
    })
    .done(function (data) {
      createTable(data);
    })
    .fail(function() {
      alert('データの取得に失敗しました。');
    })
  });

  // 翌月ボタン押下時
  $('.nextMonth').on('click', () => {
    // 変数monthを更新し、取得するログの月を決める
    month = String(Number(month) + 1);

    $.ajax('./getlogData?month=' + month, {
      type: 'GET',
    })
    .done(function (data) {
      createTable(data);
    })
    .fail(function() {
      alert('失敗しました。');
    })
  });

  // 社員名を押下したとき
  $('.staffname').on('click', () => {
    // 全社員情報取得
    $.ajax('./getAllUserData', {
      type: 'GET',
    })
    .done(function (data) {
      // モーダル作成・表示
      showModal(data);
      $('#overlay, .modal-window').fadeIn();
    })
    .fail(function () {
      alert('データの取得に失敗しました。');
    })
  });

  // 全社員名モーダルを非表示にする
  $('#overlay, .close').on('click', () => {
    $('#allUser tbody').remove();
    $("#allUser").append($("<tbody></tbody>"));
    $('#overlay, .modal-window').fadeOut();
  });
});

function init() {
  month = moment().tz("Asia/Tokyo").format('MM');
  $.ajax('./getlogData?month=' + month, {
    type: 'GET',
  })
  .done(function (data) {
    createTable(data);
    // 前月・翌月ボタン押下時テーブルを削除する処理を実行できるようにする為の変数
    initVal = true;
  })
  .fail(function() {
    alert('データの取得に失敗しました。');
  })
}

function createTable(data) {
  // 前月・翌月ボタン押下時、既存のテーブルを削除
  if(initVal) {
    $('tbody').remove();
    $("#articletable").append($("<tbody></tbody>"));
  }

  let obj = data[0];
  let 出勤時刻 = obj.出勤時刻[month + '月'];
  let 退勤時刻 = obj.退勤時刻[month + '月'];
  let 残業時間 = obj.残業時間[month + '月'];

  // 月ごとの登録数によってテーブル作成処理のループ回数を確定
  let lengthOfObject = Object.keys(出勤時刻).length; 

  // 勤怠ログテーブル作成
  let total = 0;
  for(let i = 1; i <= lengthOfObject; i++) {
    // 登録してない日の残業時間は空欄で表示する
    let zangyo = 残業時間[i+ '日'] ? 残業時間[i + '日'] + '分' : '-';
    $('#articletable tbody').append(
      $("<tr></tr>")
        .append($("<td></td>").text(出勤時刻[i + '日']))
        .append($("<td></td>").text(退勤時刻[i + '日']))
        .append($("<td></td>").text(zangyo))
    );

    // 合計残業時間の計算
    let checkZangyo = 残業時間[i + '日'] ? 残業時間[i + '日'] : 0;
    total = total + checkZangyo;
  }
  $('.zangyo_total').text('合計残業時間: ' + total + '分');
  $('h3').text(month + '月の勤怠ログ(本日から１年前のログを確認することができます。)');
}

// 全社員一覧をモーダル表示
function showModal(data) {
  let button = "<input type='button' name = 'selectUser' value = '選択'>";
  // 勤怠ログテーブル作成
  for(let i = 0; i < data.length; i++) {
    $('#allUser tbody').append(
      $("<tr></tr>")
        .append($("<td></td>").text(data[i].社員コード))
        .append($("<td></td>").text(data[i].社員名))
        .append($('<td>', {html : button }))
    );
  }
}