const express = require('express');
const router = express.Router();
const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");
const Comment = require("../models/commentModel.js");
const appError = require('../service/appError.js');
const handleErrorAsync = require('../service/handleErrorAsync.js');


// 取得貼文
router.get('/', handleErrorAsync(
  async function(req, res, next) {
    const { content, userId, sortOption = 'newToOld', _id } = req.query; // 获取查询参数中的关键字和排序选项
    const regex = new RegExp(content?.split(' ').join('|'), 'i'); // 使用正则表达式进行大小写不敏感的搜索，并将空格替换为|
    let findRegex = userId ? { user: userId, content: regex } : { content: regex };
    if ( _id ) {
      findRegex = { _id: _id }
    }
    console.log(findRegex);

    // 查询数据
    const getPost = await Post.find(findRegex)
      .populate({
        path: 'user',
        select: 'name photo'
      })
      .populate({
        path: 'comments'
      })
      .populate({
        path: 'likes'
      });

    // 基于不同的排序选项进行排序
    let sortedPosts;
    switch (sortOption) {
      case 'oldToNew':
        sortedPosts = getPost.sort((a, b) => a.createdAt - b.createdAt); // 贴文时间由旧到新
        break;
      case 'newToOld':
        sortedPosts = getPost.sort((a, b) => b.createdAt - a.createdAt); // 贴文时间由新到旧
        break;
      case 'mostLikes':
        sortedPosts = getPost.sort((a, b) => b.likes.length - a.likes.length); // 按赞数由多到少
        break;
      case 'leastLikes':
        sortedPosts = getPost.sort((a, b) => a.likes.length - b.likes.length); // 按赞数由少到多
        break;
      default:
        // 默认排序方式
        sortedPosts = getPost.sort((a, b) => b.createdAt - a.createdAt); // 默认按贴文时间由新到旧排序
        break;
    }

    res.status(200).json({
      "status": "success",
      data: sortedPosts
    });
  }
));


// 新增貼文
router.post('/',handleErrorAsync(
  async function(req, res, next) {
    if(Object.keys(req.body).length !== 0){
      const toPost = await Post.create(req.body);
      res.status(200).json({
        "status":"success",
        data: toPost
      });
    }else{
      return next(appError(400,"你沒有填寫 content 資料"))
    }
    
  }
));

// 刪除所有貼文
router.delete('/',handleErrorAsync(
  async function(req, res, next) {
    await Post.deleteMany({});
    res.status(200).json({
      "status":"success",
      data: []
    });
  }
));

// 刪除單一貼文
router.delete('/:id',handleErrorAsync(
  async function(req, res, next) {
    const { id } = req.params
    const deletePost = await Post.findByIdAndDelete(id);
    if(deletePost){
      res.status(200).json({
        "status":"success",
        data: deletePost
      });
    }else{
      return next(appError(400,"找不到該刪除資料"))
    }
  }
));

// 編輯單一貼文
router.patch('/:id',handleErrorAsync(
  async function(req, res, next) {
    const { id } = req.params
    const editPosts = await Post.findByIdAndUpdate(id,req.body,{ new: true });
    if(editPosts){
      res.status(200).json({
        "status":"success",
        data: editPosts
      });
    }else{
      return next(appError(400,"找不到該編輯資料"))
    }
  }
));

module.exports = router;
