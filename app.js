const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index.js');
const postsRouter = require('./routes/posts.js');
const usersRouter = require('./routes/users.js');
const uploadRouter = require('./routes/upload');
const commentsRouter = require('./routes/comments.js');
const likesRouter = require('./routes/likes.js');
const cors = require('cors');

const app = express();

// cors 設定
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// 程式出現重大錯誤時
process.on('uncaughtException', err => {
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
      console.error('Uncaughted Exception！')
      console.error(err.name);
      console.error(err.message);
      console.error(err.stack);
      process.exit(1);
  });

// 連接資料庫
dotenv.config({path:"./config.env"});
// const DB = process.env.DATABASE.replace(
//     '<password>',
//     process.env.DATABASE_PASSWORD
//   );

const DB = 'mongodb://127.0.0.1:27017/MetaWall';

mongoose.connect(DB).then(()=>{
    console.log('資料庫連線成功');
})
.catch((error)=>{
    console.log(error);
});

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);
// 404 中間件
app.use((req, res, next) => {
    res.status(404).json({
        "status":"success",
        "message": "無此網站路由"
    });
  });

// 接收錯誤
app.use(function(err,req,res,next){
    console.log("觸發 app.use 的接收錯誤");
    res.status(500).json({
        "message": err.message,
        "error": err,
        "stack": err.stack
    })
})

// 未捕捉到的 catch 
process.on('unhandledRejection', (reason, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', reason);
    // 記錄於 log 上
  });

module.exports = app;
