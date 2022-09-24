$(function () {
  $(window).on('load', () => {
    alert('ログインしてません。');
    location.href = '/attendance/login';
  })
});