const express = require('express');
const router = express.Router();
const Like = require("../models/likeModel.js");
const Post = require("../models/postModel.js");
// const User = require("../models/userModel.js");
const appError = require('../service/appError.js');
const handleErrorAsync = require('../service/handleErrorAsync.js');

// validator 驗證
const validator = require('validator');


// 取得按讚
router.get('/',handleErrorAsync(
  async function(req, res, next) {
    const getLike = await Like.find(req.query).populate({
      path:'user',
      select:'name photo'
    }).populate({
      path: 'post',
    });
    res.status(200).json({
      "status":"success",
      data: getLike
    });
  }
));

// 新增按讚
router.post('/',handleErrorAsync(
  async function(req, res, next) {

    if(validator.isEmpty(req.body.user)){return next(appError(400,"使用者 ID 不得為空"))};
    if(validator.isEmpty(req.body.post)){return next(appError(400,"貼文 ID 不得為空"))};


      // 先檢查該使用者是否已經對該貼文按過讚
      const userId = req.body.user;
      const postId = req.body.post;
      const isRepeatLike = await Like.findOne({ post: postId, user: userId });
      if (isRepeatLike) {
        return next(appError(400,"你已按過讚"))
      }else{
        const toLike = await Like.create(req.body);
        res.status(200).json({
            "status":"success",
            data: toLike,
          });
      }    
  }
));

// 刪除所有按讚
router.delete('/',handleErrorAsync(
  async function(req, res, next) {
    await Like.deleteMany({});
    res.status(200).json({
      "status":"success",
      data: []
    });
  }
));

// 刪除單一按讚
router.delete('/:id',handleErrorAsync(
  async function(req, res, next) {
    const { id } = req.params
    const deleteLike = await Like.findByIdAndDelete(id);

    if(deleteLike){
      res.status(200).json({
        "status":"success",
        data: deleteLike
      });
    }else{
      return next(appError(400,"找不到該刪除資料"))
    }
  }
));

module.exports = router;
