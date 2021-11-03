const mysql = require('mysql');
const util = require('util');

module.exports.edit = function(req, res){
  let code = req.body.code;
  let name = req.body.name;
  let price = req.body.price;
  let gazou_old = req.body.gazou_name_old;

  // if( name === '') {
  //   name = '商品名が入力されていません。';
  // };

 if( /[^0-9]/.test(price)){
    price = 'husei';
  }

  let data = {
    code: code,
    name: name,
    price: price,
    gazou_old: gazou_old
    // _csrf: request.body._csrf
  };
  return data;
};

module.exports.ref = async function(req, res, code){
  let a;

  // DB接続
  let connection = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    let columns = ['name', 'price', 'gazou'];
    let result = await connection.query('SELECT ?? FROM mst_product WHERE code = ?', [columns, code]);
    a = result.map((row) => {
      let data = {
        code: code,
        name: row.name,
        price: row.price,
        gazou: row.gazou
      };
  
      return data;
    });
    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql');
    });
  }
  catch (err) {
    throw new Error(err)
  }
  return a;
};

module.exports.product = async function(req, res){
  let name = req.body.name;
  let price = req.body.price;
  let gazou = req.file.originalname;

  let product_data = {
      name: name,
      price: price,
      gazou: gazou
      // _csrf: request.body._csrf
  };

  // DB接続
  let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
  });
  
  connection.connect();

  connection.query('insert into mst_product set ?', product_data, (err) => {
    if (err) throw err;
  });

  // 切断
  connection.end((err) => {
    if (err) throw err;
    console.log('切断 to mysql');
  });
}

module.exports.update = function(req, res){
  let code = req.body.code;
  let name = req.body.name;
  let price = req.body.price;
  let gazou = req.file.originalname;

  let product_data = {
    code: code,
    name: name,
    price: price,
    gazou: gazou
    // _csrf: request.body._csrf
  };

  // DB接続
  let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
    });
    
    connection.connect();
    
    connection.query('UPDATE mst_product SET name = ?,price = ?,gazou = ? WHERE code = ?', [name, price, gazou, code], (err, res) => {
    if (err) throw err;

    // 切断
    connection.end((err) => {
      if (err) throw err;
        console.log('切断 to mysql');
      });
    });
    return product_data;
};

module.exports.deleteData = function (req, res) {
  let code = req.body.code;
  let a;
  let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
    });
    
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)

  connection.query('DELETE FROM mst_product WHERE code = ?', [code], (err, res) => {
    if (err) throw err;
    // 切断
    connection.end((err) => {
      if (err) throw err;
        console.log('切断 to mysql');
      });
  });
};

module.exports.getProductData =async function (req, res) {
  let a;
  // DB接続
  let connection = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    let result = await connection.query('SELECT code,name,price,gazou FROM mst_product');
    a = result.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
        price: row.price,
        gazou: row.gazou
      };
  
      return data;
    });
    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql');
    });
  }
  catch (err) {
    throw new Error(err)
  }
  return a;
};

module.exports.getProductOneData = async function(req,res) {
  let productcode = req.query.code;
  let a;
  // DB接続
  let connection = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    let result = await connection.query('SELECT code,name,price,gazou FROM mst_product WHERE code = ?',[productcode]);
    a = result.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
        price: row.price,
        gazou: row.gazou
      };
  
      return data;
    });
    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql');
    });
  }
  catch (err) {
    throw new Error(err)
  }
  return a;
};