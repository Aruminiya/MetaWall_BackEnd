const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
        createdAt: {
            type: Date,
            default: Date.now,
            // select 保護起來 只能在資料庫看到 前台回傳看不到
            select: true
        },
        content:{
            type:String,
            required: [true,"內文必填"]
        },
        likes:{
            type:Number,
            default: 0
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            require:[true,"留言姓名未填寫"]
        }
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

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;