$(function () {
  // $(".menu1").hover(
  //   function () {
  //     $(".hover1").removeClass("visible");
  //   },
  //   function () {
  //     $(".hover1").addClass("visible");
  //   }
  // );

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
      location.href = '/attendance';
    })
    .fail(function() {
      alert('ログインに失敗しました');
    })
  });
}); 