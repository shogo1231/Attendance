let express = require('express');
let router = express.Router();
// let fs = require('fs');
// let path = require('path');
let login = require('../models/login');
let register = require('../models/register');
let staff = require('../models/staff')

/*****************************************************************************************/
// 全社員情報取得
router.get('/getAllUserData', async function(req, res) {
  try {
    let data = await staff.getAllUserData();
    res.send(data);
  }
  catch {
    console.log(err);
    res.status(500);
  }
});

/*****************************************************************************************/
// 全社員勤怠ログ画面表示
router.get('/allstafflog', async function (req, res) {
  try {
    let user = await login.sessionCheck(req.session, res);
    res.render('logAll', { user });
  }
  catch(err) {
    console.log(err);
    res.status(500);
  }
});

// 全社員勤怠ログデータ取得
router.get('/getalllogData', async function (req, res) {
  try {
    await login.sessionCheck(req.session, res);
    let user = req.query.code;
    let data = await register.getallRegisterLog(user, req.query.month);
    res.send(data);
  }
  catch(err) {
    console.log(err);
    res.status(500);
  }
});

module.exports = router;