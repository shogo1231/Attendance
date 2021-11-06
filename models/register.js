let mongodb = require('./mongodb');
let common = require('./common');
let Information = common.information();
const key = 'user';
// 現在日付の取得(YYYY/MM/DD)
let rtn_str = getStringFromDate(new Date());

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

  // 出勤時刻と日付の登録
  await db.collection("timecard")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        出勤時刻: receiveData,
      }
    },
    { upsert: true }
  );

  // ログ取得
  let logData = await timecardLogData(db, user);

  // ログデータ生成
  let syukkin_logData = logData[0].出勤時刻;
  syukkin_logData.push(receiveData);

  // ログ登録
  await db.collection("timecardLog")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        出勤時刻: syukkin_logData,
      }
    },
    { upsert: true }
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
    },
    { upsert: true }
  );

  // ログ取得
  let logData = await timecardLogData(db, user);

  // ログデータ生成
  let taikin_logData = logData[0].退勤時刻;
  taikin_logData.push(receiveData);

  // ログ登録
  await db.collection("timecardLog")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        退勤時刻: taikin_logData,
      }
    },
    { upsert: true }
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

  // 出勤・退勤情報取得
  let data = await db.collection("timecard")
  .find(
    {
      社員コード: user[0].社員コード,
    }
  )
  .toArray();

  // 出勤・退勤情報がない場合（新規登録ユーザなど）
  if(!data.length) {
    data = await resetAttendanceData(db, rtn_str, user);
    data = await resetAttendanceLogData(db, rtn_str, user);
  }

  // 現在日付と出勤・退勤登録した日付が異なる場合、出勤・退勤登録内容をリセット
  if(data[0].登録日 !== rtn_str) {
    data = await resetAttendanceData(db, rtn_str, user);
  }

  return data;
}

//日付から文字列に変換する関数
function getStringFromDate(date) {
  let year_str = date.getFullYear();
  let month_str = 1 + date.getMonth(); //月だけ+1すること
  let day_str = date.getDate();
  
  format_str = 'YYYY/MM/DD';
  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);
  
  return format_str;
};

async function resetAttendanceData(db, rtn_str, user) {
  // 出勤・退勤登録情報初期化
  await db.collection("timecard")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        出勤時刻: null,
        退勤時刻: null,
        登録日: rtn_str,
      }
    },
    { upsert: true }
  );

  // 出勤・退勤情報再取得
  let result = await db.collection("timecard")
  .find(
    {
      社員コード: user[0].社員コード,
    }
  )
  .toArray();

  return result;
}

async function resetAttendanceLogData(db, rtn_str, user) {
  // 出勤・退勤登録情報ログ初期化
  let enptyData = [];
  await db.collection("timecardLog")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        出勤時刻: enptyData,
        退勤時刻: enptyData,
        初回登録日: rtn_str,
      }
    },
    { upsert: true }
  );
}

async function timecardLogData(db, user) {
  let result = await db.collection('timecardLog')
  .aggregate([
    {
      $match: {
        社員コード: user[0].社員コード
      }
    },
    {
      $project: {
        _id: 0,
        出勤時刻: 1,
        退勤時刻: 1,
      }
    }
  ])
  .toArray();
  return result;
}