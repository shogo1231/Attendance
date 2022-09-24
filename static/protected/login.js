$(function () {
  $(".submit").on('click', () => {
    let data = {}
    data.code = $('input[name="code"]').val();
    data.pass = $('input[name="pass"]').val();

    window.sessionStorage.setItem(['キー名'],['test']);

    $.ajax('./staff_login_check', {
      type: 'POST',
      data: data,
    })
    .done(function(){
      location.href = './main/top';
    })
    .fail(function() {
      alert('ログインに失敗しました');
    })
  });
});