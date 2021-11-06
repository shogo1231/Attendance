let express = require('express');
let router = express.Router();
// let fs = require('fs');
// let path = require('path');
let login = require('../models/login');
let register = require('../models/register');

/***********************************************************************/
// 出勤ボタン押下時
router.post('/syukkin_register', async function (req, res) {
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
router.post('/taikin_register', async function (req, res) {
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