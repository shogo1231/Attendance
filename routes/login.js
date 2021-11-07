let express = require('express');
let router = express.Router();
// let fs = require('fs');
// let path = require('path');
let login = require('../models/login');
let register = require('../models/register');

/***********************************************************************/
// サイトアクセスされた時
router.get('/', async function (req, res) {
  try {
    res.render('staff_login');
  } 
  catch(err) {
    console.log(err);
    res.status(500);
  }
});

// ログインボタン押下時
router.post('/staff_login_check', async function (req, res) {
  try {
    await login.login_check(req, res);
    res.status(200).send('ok');
  }
  catch(err) {
    console.log(err);
    res.status(500).send('error');
  }
});

// 画像アップロードモジュール
// let multer = require('multer');
// const { send } = require('process');
// let storage = multer.diskStorage({
//   //ファイルの保存先を指定(ここでは保存先は./public/images) 
//   //Express4の仕様で画像(静的)なファイルを保存するときはpublic/以下のフォルダに置かないとダメらしい
//   //詳しくは express.static public でググろう！
//   destination: function(req, file, cb){
//     cb(null, './store/static/public/images/')
//   },
//   //ファイル名を指定
//   filename: function(req, file, cb){
//     cb(null, file.originalname)
//   }
// });
// let upload = multer({storage: storage});

/***********************************************************************/
// 商品登録処理
// router.post('/product_add_check', upload.single('gazou'), async function (req, res) {
//   try {
//     await product_check.product(req,res);
//     res.status(200).send('ok');
//   } 
//   catch(err) {
//     console.log(err);
//     res.status(500);
//   }
// });

// // 商品登録画面
// router.get('/add', function (req, res) {
//   try {
//     if (req.session.user) {
//       res.render('product/product', { title: 'ろくまる農園'});
//     }
//     else {
//       res.redirect('/');
//     }
//   }
//   catch(err) {
//     console.log(err);
//     res.status(500);
//   }
// });

// // 商品一覧画面
// router.get('/list', async function(req,res) {
//   if (req.session.user) {
//     let rows = await product_check.getProductData(req,res);
//     res.render('product/product_list', { title: 'ろくまる農園', rows});
//   }
//   else {
//     res.redirect('/');
//   }
// });

// // 商品編集画面
// router.get('/product_edit', async function (req, res) {
//   let row = await product_check.getProductOneData(req,res);
//   res.render('product/product_edit', { title: 'ろくまる農園', row});
// });

// // 編集情報処理
// router.post('/product_edit_check', upload.single('gazou'), function (req, res) {
//   try {
//     // let data = product_check.edit(req,res);
//     let oldFile = req.body.gazou_name_old;
//     let fileName = req.file.originalname;

//     if(oldFile !== fileName && oldFile !== '') {
//       // publicディレクトリ内にある更新前の画像データを削除
//       fs.unlink(path.resolve()+'/store/static/public/images/'+oldFile, (err) => {
//         if (err) return;
//       });
//     }

//     // mst_productデータベース更新
//     let updateData = product_check.update(req,res);
//     res.status(200).send('ok');
//   }
//   catch(err) {
//     console.log(err);
//     res.status(500);
//   }
// });

// // 商品削除押下時
// router.delete('/delete', function(req, res) {
//   try {
//     product_check.deleteData(req, res);
//     res.send('削除しました。');
//   }
//   catch(err) {
//     res.status(500).send('削除に失敗しました。')
//   }
// });

// // 商品情報参照
// router.get('/reference', async function(req,res) {
//   if (req.session.user) {
//     let code = req.query.code;
//     let data = await product_check.ref(req,res,code);
//     res.render('product/product_reference',{ title: 'ろくまる農園', data});
//   }
//   else {
//     res.redirect('/');
//   }
// });

module.exports = router;