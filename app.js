const express = require("express");
const cookie = require("cookie-parser");
const session = require("express-session");
let auth = require("./middleware.js");
const app  = express();
const PORT = 3000 // 5000 heroku用 process.env.PORT ||

// テンプレートエンジンをEJSに設定
// 複数サイトがある場合は第2、第3引数にpathを記述
app.set('views', './views');
app.set('view engine', 'ejs');

// public配下の静的ファイルは無条件に公開
app.use('/static', express.static(__dirname+'/static'));

// ミドルウエアの設定
app.use(cookie());
app.use(session({
  secret: "YOUR SECRET SALT",
  resave: false, 
  saveUninitialized: true,
  cookie:{
    httpOnly: true, // クライアント側でクッキー値を見れない、書きかえれないようにするオプション
    secure: false, // httpsで使用する場合はtrueにする。今回はhttp通信なのでfalse
    maxAge: 1000 * 60 * 30 // セッションの消滅時間。単位はミリ秒。ミリ秒は千分の一秒なので1000 * 60 * 30で30分と指定。
    }
}));

// req.bodyをとるために必要
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ルーティングの設定 
app.use('/register', auth('管理'), require('./routes/register.js'));
app.use('/attendance', auth('管理'), require('./routes/attendance.js'));


// HTTPサーバ接続
app.listen(PORT, () => {
  app.use('/', require('./routes/login.js'));
  console.log(`Listening on ${PORT}`);
});