let express = require('express');
let router = express.Router();
// let fs = require('fs');
// let path = require('path');
let login = require('../models/login');
let register = require('../models/register');
let staff = require('../models/staff')

/*****************************************************************************************/
// 勤怠入力画面表示(ここがメインページとなる想定)
router.get('/top', async function (req, res) {
  try {
    let user = await login.sessionCheck(req.session, res);
    let data = await register.getRegisterData(user);
    res.render('main', { user, data });
  }
  catch(err) {
    console.log(err);
    res.status(500);
  }
});

/*****************************************************************************************/
// 勤怠ログ画面表示
router.get('/log', async function (req, res) {
  try {
    let user = await login.sessionCheck(req.session, res);
    res.render('log', { user });
  }
  catch(err) {
    console.log(err);
    res.status(500);
  }
});

// 勤怠ログデータ取得
router.get('/getlogData', async function (req, res) {
  try {
    let user = await login.sessionCheck(req.session, res);
    let data = await register.getRegisterLog(user, req.query.month);
    // await register.importData();
    res.send( data );
  }
  catch(err) {
    console.log(err);
    res.status(500);
  }
});

/***********************************************************************/
// 出勤ボタン押下時
router.post('/register/syukkin_register', async function (req, res) {
  try {
    let user = await login.sessionCheck(req.session, res);
    let data = await register.syukkin_register(req, res, user);
    res.status(200).send(data);
  }
  catch(err) {
    console.log(err);
    res.status(500).send('error');
  }
});

// 退勤ボタン押下時
router.post('/register/taikin_register', async function (req, res) {
  try {
    let user = await login.sessionCheck(req.session, res);
    let data = await register.taikin_register(req, res, user);
    res.status(200).send(data);
  }
  catch(err) {
    console.log(err);
    res.status(500).send('error');
  }
});

module.exports = router;