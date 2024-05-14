const express = require('express');
const router = express.Router();
const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");
const Comment = require("../models/commentModel.js");
const appError = require('../service/appError.js');
const handleErrorAsync = require('../service/handleErrorAsync.js');


// 取得貼文
router.get('/',handleErrorAsync(
  async function(req, res, next) {
    const getPost = await Post.find(req.query).populate({
      path:'user',
      select:'name photo'
    }).populate({
      path: 'likes',
      select:'name photo'
    }).populate({
      path: 'comments',
      populate: { // 嵌套 populate
        path: 'user',
        select: 'name photo'
      }
    });
    res.status(200).json({
      "status":"success",
      data: getPost
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
