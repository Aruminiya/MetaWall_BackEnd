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

// 在查詢 like 時，自動填充 user 和 post 字段
likeSchema.pre(/^find/, function(next) {
    // ^find 表示匹配所有以 "find" 開頭的查詢方法（如 find, findOne, findById 等）
    this.populate({
        path: 'user', // 指定要填充的字段是 user
        select: 'name id createdAt' // 填充時選擇的字段，這裡只選擇 name, id 和 createdAt
    }).populate({
        path: 'post', // 指定要填充的字段是 post，這裡填充所有字段
        populate: {
            path: 'user',
            select: 'name photo' // 选择需要返回的字段
        }
    });

    next(); // 調用 next() 以繼續查詢流程
});

const Like = mongoose.model('Like', likeSchema);
// Room 會被變成 rooms
// 開頭變小寫
// 強制加上 s

module.exports = Like;