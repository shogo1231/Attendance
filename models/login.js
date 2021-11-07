let mongodb = require('./mongodb');
let common = require('./common');
let Information = common.information();
const key = 'user';

/**
 * ログインチェック・セッション格納処理
 */
module.exports.login_check = async function(req, res) {
  let code = req.body.code;
  let pass = req.body.pass;
  let client;

  // MongoDBへ接続
  client = await mongodb.client();
  
  // collection名取得
  let collection = Information.collection;

  // コレクションの取得
  const db = client.db(collection);

  // ログイン情報チェック
  let user = await db.collection("user").find({
    社員コード: code,
    パスワード: pass
  })
  .toArray();

  if (user.length === 0) throw new Error('ログイン失敗');

  // ログイン成功時、ユーザ情報をセッションに格納
  req.session.user = user;
};

/**
 * セッションにユーザ情報が格納されているか確認
 */
module.exports.sessionCheck = async function(session, res) {
  if (!session[key]) {
    // return res.redirect('/');
  } else {
    return session[key];
  }
};