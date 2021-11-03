let mongodb = require('./mongodb');
let common = require('./common');
let Information = common.information();
const key = 'user';

/**
 * 出勤登録処理
 */
module.exports.syukkin_register = async function(req, res, user) {
  let receiveData = req.body.from; // 'YYYY/MM/DD HH:mm:ss'
  // MongoDBへ接続
  client = await mongodb.client();
  
  // collection名取得
  let collection = Information.collection;

  // コレクションの取得
  const db = client.db(collection);

  // 出勤時刻の登録
  await db.collection("timecard")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        出勤時刻: receiveData,
      }
    }, { upsert: true }
  );

  return receiveData;
};

/**
 * 退勤登録処理
 */
module.exports.taikin_register = async function(req, res, user) {
  let receiveData = req.body.from; // 'YYYY/MM/DD HH:mm:ss'
  // MongoDBへ接続
  client = await mongodb.client();
  
  // collection名取得
  let collection = Information.collection;

  // コレクションの取得
  const db = client.db(collection);

  // 退勤時刻の登録
  await db.collection("timecard")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        退勤時刻: receiveData,
      }
    }, { upsert: true }
  );

  return receiveData;
};

/**
 * 出勤・退勤登録情報取得
 */
module.exports.getRegisterData = async function(user) {
  // MongoDBへ接続
  client = await mongodb.client();

  // collection名取得
  let collection = Information.collection;

  // コレクションの取得
  const db = client.db(collection);
  
  // 退勤時刻の登録
  let data = await db.collection("timecard")
  .find(
    {
      社員コード: user[0].社員コード,
    }
  )
  .toArray();

  return data;
}