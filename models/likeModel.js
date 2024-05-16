const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:[true,"使用者未填寫"]
        },
        post:{
            type:mongoose.Schema.ObjectId,
            ref:"Post",
            required:[true,"貼文未填寫"]
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // select 保護起來 只能在資料庫看到 前台回傳看不到
            select: true
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
)

const Like = mongoose.model('Like', likeSchema);
// Room 會被變成 rooms
// 開頭變小寫
// 強制加上 s

module.exports = Like;