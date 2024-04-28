const express = require('express');
const router = express.Router();
const Post = require("../models/postModel.js");
// const User = require("../models/userModel.js");
const handleError = require('../handleError.js');
const handleSuccess = require('../handleSuccess.js');


// 取得貼文
router.get('/',async function(req, res, next) {
  try{
    const getPost = await Post.find(req.query).populate({
      path:'user',
      slect:'email'
    });
    handleSuccess(res, getPost);
  }catch(err){
    handleError(res, err, "取得貼文資料失敗");
  }
});

// 新增貼文
router.post('/',async function(req, res, next) {
  try{
    const toPost = await Post.create(req.body);
    handleSuccess(res, toPost);
  }catch(err){
    handleError(res, err, "資料傳輸或建立失敗");
  }
});

// 刪除所有貼文
router.delete('/',async function(req, res, next) {
  try{
    await Post.deleteMany({});
    handleSuccess(res, []);
  }catch(err){
    handleError(res, err, "刪除所有貼文資料失敗");
  }
});

// 刪除單一貼文
router.delete('/:id',async function(req, res, next) {
  try{
    const { id } = req.params
    const deletePost = await Post.findByIdAndDelete(id);
    handleSuccess(res, deletePost);
  }catch(err){
    handleError(res, err, "刪除單一貼文資料失敗");
  }
});

// 編輯單一貼文
router.patch('/:id',async function(req, res, next) {
  try{
    const { id } = req.params
    const editPosts = await Post.findByIdAndUpdate(id,req.body,{ new: true });
    handleSuccess(res, editPosts);
  }catch(err){
    handleError(res, err, "編輯單一貼文資料失敗");
  }
});

module.exports = router;
