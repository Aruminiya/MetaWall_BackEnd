const express = require('express');
const router = express.Router();
const Comment = require("../models/commentModel.js");
// const User = require("../models/userModel.js");
const appError = require('../service/appError.js');
const handleErrorAsync = require('../service/handleErrorAsync.js');

// validator 驗證
const validator = require('validator');

// 取得留言
router.get('/',handleErrorAsync(
  async function(req, res, next) {
    const getComment = await Comment.find(req.query).populate({
      path:'user',
      select:'name photo'
    })
    res.status(200).json({
      "status":"success",
      data: getComment
    });
}
));

// 新增留言
router.post('/',handleErrorAsync(
  async function(req, res, next) {
      if(validator.isEmpty(req.body.content)){return next(appError(400,"留言內容不得為空"))};
      if(validator.isEmpty(req.body.user)){return next(appError(400,"使用者 ID 不得為空"))};
      if(validator.isEmpty(req.body.post)){return next(appError(400,"貼文 ID 不得為空"))};

      const toComment = await Comment.create(req.body);
      res.status(200).json({
        "status":"success",
        data: toComment
    });
    
  }
));

// 刪除所有留言
router.delete('/',handleErrorAsync(
  async function(req, res, next) {
    await Comment.deleteMany({});
    res.status(200).json({
      "status":"success",
      data: []
    });
  }
));

// 刪除單一留言
router.delete('/:id',handleErrorAsync(
  async function(req, res, next) {
    const { id } = req.params
    const deleteComment = await Comment.findByIdAndDelete(id);
    if(deleteComment){
      res.status(200).json({
        "status":"success",
        data: deleteComment
      });
    }else{
      return next(appError(400,"找不到該刪除資料"))
    }
  }
));

// 編輯單一留言
router.patch('/:id',handleErrorAsync(
  async function(req, res, next) {
    const { id } = req.params
    const editComment = await Comment.findByIdAndUpdate(id,req.body,{ new: true });
    if(editComment){
      res.status(200).json({
        "status":"success",
        data: editComment
      });
    }else{
      return next(appError(400,"找不到該編輯資料"))
    }
  }
));

module.exports = router;
