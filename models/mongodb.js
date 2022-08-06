let MongoClient = require("mongodb").MongoClient;

module.exports.client = async function(){
  let client = MongoClient.connect("mongodb+srv://shogo123198:k6k6k6k6@cluster0.oxpvkdc.mongodb.net", {
    useNewUrlParser: true // データベースをデフォルトのポート（27017）に接続するために必要な最小値です。
  });
  return client;
};

module.exports.getData = function(){
  let data = {}
  // 接続文字列
  data.url = "mongodb://localhost:27017/testdb";
  // collection名
  data.collection = "attendance";
  return data;
};
