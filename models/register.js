let mongodb = require('./mongodb');
let common = require('./common');
let dayjs = require('dayjs');
let Information = common.information();

/**
 * 出勤登録処理
 */
module.exports.syukkin_register = async function(req, res, user) {
  // 出勤時刻
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

  // フィールド名生成
  let month = dayjs(receiveData).format('MM') + '月';
  let day = dayjs(receiveData).format('DD').replace(/^0+/, '') + '日';
  let field = '出勤時刻.' + month + '.' + day

  // ログ登録
  await db.collection("timecardLog")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        [field]: receiveData,
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
  // 退勤時刻
  let receiveData = req.body.from; // 'YYYY/MM/DD HH:mm:ss'
  // 定時
  let onTime = req.body.onTime; // 'YYYY/MM/DD HH:mm:ss'

  // 残業時間計算
  let dateTo = dayjs(onTime);
  let dateFrom = dayjs(receiveData);
  let zangyo = Math.trunc(dateFrom.diff(dateTo) / (60 * 1000));
  let zangyoTime = zangyo >= 0 ? zangyo : 0;
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
        残業時間: zangyoTime,
      }
    },
    { upsert: true }
  );

  // フィールド名生成
  let month = dayjs(receiveData).format('MM') + '月';
  let day = dayjs(receiveData).format('DD').replace(/^0+/, '') + '日';
  let fieldTaikin = '退勤時刻.' + month + '.' + day
  let fieldZangyo = '残業時間.' + month + '.' + day

  // ログ登録
  // 配列の最後を削除後、ログを追加する
  await db.collection("timecardLog")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        [fieldTaikin]: receiveData,
        [fieldZangyo]: zangyoTime,
      }
    },
    { upsert: true }
  );
  return receiveData;
};

/**
 * 今日の出勤・退勤登録情報取得
 */
module.exports.getRegisterData = async function(user) {
  // 現在日付の取得(YYYY/MM/DD)
  let rtn_str = getStringFromDate(new Date());

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

/**
 * 出勤・退勤登録ログ取得
 */
module.exports.getRegisterLog = async function (user, month) {
  // MongoDBへ接続
  client = await mongodb.client();

  // collection名取得
  let collection = Information.collection;

  // コレクションの取得
  const db = client.db(collection);

  // 出勤・退勤情報取得
  let 出勤時刻 = '出勤時刻.' + month + '月';
  let 退勤時刻 = '退勤時刻.' + month + '月';
  let 残業時間 = '残業時間.' + month + '月';

  let data = await db.collection("timecardLog")
  .aggregate([
    {
      $match: {
        社員コード: user[0].社員コード,
      }
    },
    {
      $project: {
        _id: 0,
        [出勤時刻]: 1,
        [退勤時刻]: 1,
        [残業時間]: 1,
      },
    },
    // {
    //   $unwind: "$Oct"
    // },
  ])
  .toArray();
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
        残業時間: null,
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
  let emptyData = [];
  await db.collection("timecardLog")
  .updateOne(
    {
      社員コード: user[0].社員コード,
    },
    { $set: 
      {
        Oct: emptyData,
        初回登録日: rtn_str,
      }
    },
    { upsert: true }
  );
}

/**
 * ログ作成用
 */
 module.exports.importData = async function () {
  // MongoDBへ接続
  client = await mongodb.client();

  // collection名取得
  let collection = Information.collection;

  // コレクションの取得
  const db = client.db(collection);

  // ログデータ作成
  let year = [];
  let year_taikin = [];
  let year_zangyo = [];

  // 月
  for( let j = 1; j <= 12; j++ ) {
    // 日
    let doc = {};
    let doc_taikin = {};
    let doc_zangyo = {};
    if(j === 2) {
      for( let i = 1; i <= 28; i++ ) {
        let date = '2021/' + j  + '/' + i + ' 8:00:00';
        let date_taikin = '2021/' + j  + '/' + i + ' 17:30:00';
        let zangyo = 30;
        let hiduke = i + '日';

        let mergeData = { [hiduke] : date };
        let merge_taikin = { [hiduke] : date_taikin };
        let merge_zangyo = { [hiduke] : zangyo };

        Object.assign(doc, mergeData);
        Object.assign(doc_taikin, merge_taikin);
        Object.assign(doc_zangyo, merge_zangyo);
      }
      year.push(doc);
      year_taikin.push(doc_taikin);
      year_zangyo.push(doc_zangyo);
    }
    else if( [4,6,9,11].includes(j) ) {
      for(let i = 1; i <= 30; i++) {
        let date = '2021/' + j  + '/' + i + ' 8:00:00';
        let date_taikin = '2021/' + j  + '/' + i + ' 17:30:00';
        let zangyo = 30;
        let hiduke = i + '日';

        let mergeData = { [hiduke] : date };
        let merge_taikin = { [hiduke] : date_taikin };
        let merge_zangyo = { [hiduke] : zangyo };

        Object.assign(doc, mergeData);
        Object.assign(doc_taikin, merge_taikin);
        Object.assign(doc_zangyo, merge_zangyo);
      }
      year.push(doc);
      year_taikin.push(doc_taikin);
      year_zangyo.push(doc_zangyo);
    }
    else {
      for(let i = 1; i <= 31; i++) {
        let date = '2021/' + j  + '/' + i + ' 8:00:00';
        let date_taikin = '2021/' + j  + '/' + i + ' 17:30:00';
        let zangyo = 30;
        let hiduke = i + '日';

        let mergeData = { [hiduke] : date };
        let merge_taikin = { [hiduke] : date_taikin };
        let merge_zangyo = { [hiduke] : zangyo };

        Object.assign(doc, mergeData);
        Object.assign(doc_taikin, merge_taikin);
        Object.assign(doc_zangyo, merge_zangyo);
      }
      year.push(doc);
      year_taikin.push(doc_taikin);
      year_zangyo.push(doc_zangyo);
    }
  }

  let data = [
    {
      出勤時刻: {
        '1月': year[0],
        '2月': year[1],
        '3月': year[2],
        '4月': year[3],
        '5月': year[4],
        '6月': year[5],
        '7月': year[6],
        '8月': year[7],
        '9月': year[8],
        '10月': year[9],
        '11月': year[10],
        '12月': year[11],
      },
      退勤時刻: {
        '1月': year_taikin[0],
        '2月': year_taikin[1],
        '3月': year_taikin[2],
        '4月': year_taikin[3],
        '5月': year_taikin[4],
        '6月': year_taikin[5],
        '7月': year_taikin[6],
        '8月': year_taikin[7],
        '9月': year_taikin[8],
        '10月': year_taikin[9],
        '11月': year_taikin[10],
        '12月': year_taikin[11],
      },
      残業時間: {
        '1月': year_zangyo[0],
        '2月': year_zangyo[1],
        '3月': year_zangyo[2],
        '4月': year_zangyo[3],
        '5月': year_zangyo[4],
        '6月': year_zangyo[5],
        '7月': year_zangyo[6],
        '8月': year_zangyo[7],
        '9月': year_zangyo[8],
        '10月': year_zangyo[9],
        '11月': year_zangyo[10],
        '12月': year_zangyo[11],
      }
    }
  ];

  // ログデータのインサート
  await db.collection("timecardLog")
  .updateMany(
    {
      社員コード: "1"
    },
    {
      $set: data[0]
    },
    {
      upsert: true
    }
  );
}