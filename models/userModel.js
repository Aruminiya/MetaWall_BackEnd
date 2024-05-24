const mongoose = require('mongoose');

// 子文件 schema，用於 follower 和 following 關係
const relationshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String,
    sex: {
      type: String,
      enum: ["male","female","other"]
    },
    password: {
      type: String,
      required: [true, '請輸入您的密碼'],
      minlenth: 8,
      select: false
    },
    follower: [
      relationshipSchema
    ],
    following: [
      relationshipSchema
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      // select 保護起來 只能在資料庫看到 前台回傳看不到
      select: false
    },
  },
  // versionKey 不要加入 mongoose 預設的 __v
  // collection 自訂資料庫集合名稱 不受 mongoose 預設規範限制
  // timestamps 資料創建日期 資料更新日期
  {
    versionKey: false,
    // collection: 'room',
    // timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;