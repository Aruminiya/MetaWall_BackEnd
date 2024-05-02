const mongoose = require('mongoose');
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