let mongodb = require('./mongodb');
let common = require('./common');
const { use } = require('passport');
let Information = common.information();
const key = 'user';

/**
 * 全社員情報取得
 */
module.exports.getAllUserData = async function(req, res) {
  // MongoDBへ接続
  client = await mongodb.client();
  
  // collection名取得
  let collection = Information.collection;

  // コレクションの取得
  const db = client.db(collection);

  // 全社員情報取得
  let user = await db.collection("user")
  .find()
  .toArray();

  if (user.length === 0) throw new Error('社員が一人もいません。');

  return user;
};