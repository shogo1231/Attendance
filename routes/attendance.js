let express = require('express');
let router = express.Router();
// let fs = require('fs');
// let path = require('path');
let login = require('../models/login');
let register = require('../models/register');

// 勤怠入力画面表示
router.get('/', async function (req, res) {
  try {
    let user = await login.sessionCheck(req.session, res);
    let data = await register.getRegisterData(user);
    res.render('attendance', { user, data });
  } 
  catch(err) {
    console.log(err);
    res.status(500);
  }
});

// 勤怠ログ画面表示
router.get('/log', async function (req, res) {
  try {
    let user = await login.sessionCheck(req.session, res);
    res.render('attendancelog', { user });
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
    let data = await register.getRegisterLog(user);
    await register.importData();
    res.send( data );
  } 
  catch(err) {
    console.log(err);
    res.status(500);
  }
});

module.exports = router;