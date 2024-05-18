const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
        tags:Array,
        type: String,
        image: String,
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
        // likes:[
        //     {
        //         type:mongoose.Schema.ObjectId,
        //         ref:"Like",
        //     }
        // ],
        // comments:{
        //     type:Array,
        //     ref:"Comment",
        //     default: []
        // },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:[true,"貼文姓名未填寫"]
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

// ref: 'Comments'：這指定了 Mongoose 應該在 Comments 模型中查找相關的文檔。
// foreignField: 'post'：這指定了在 Comments 模型中，用於關聯到 post 模型的字段是 post。
// localField: '_id'：這指定了在 post 模型中，當前文檔的 _id 字段將用來匹配 Comments 模型中的 post 字段。

// 添加虚拟字段 comments
postSchema.virtual('comments', {
    ref: 'Comment',       // 引用的模型名称
    foreignField: 'post',  // Comments 模型中对应的字段
    localField: '_id'      // Post 模型中的字段
});

// 添加虚拟字段 likes
postSchema.virtual('likes', {
    ref: 'Like',          // 引用的模型名称
    foreignField: 'post',  // Likes 模型中对应的字段
    localField: '_id'      // Post 模型中的字段
});

// 如果你希望在将文档转换为对象或 JSON 时包含虚拟字段（virtuals），你需要设置 toObject 和 toJSON 选项。这两个选项允许虚拟字段在调用 .toObject() 和 .toJSON() 方法时出现在输出中。

// 启用虚拟字段在 JSON 结果中的显示
postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });


const Post = mongoose.model('Post', postSchema);
// Room 會被變成 rooms
// 開頭變小寫
// 強制加上 s

module.exports = Post;