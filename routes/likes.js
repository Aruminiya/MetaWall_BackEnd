const express = require('express');
const router = express.Router();
const Like = require("../models/likeModel.js");
const Post = require("../models/postModel.js");
// const User = require("../models/userModel.js");
const appError = require('../service/appError.js');
const handleErrorAsync = require('../service/handleErrorAsync.js');


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
    if(Object.keys(req.body).length !== 0){

      // 先檢查該使用者是否已經對該貼文按過讚
      const userId = req.body.user;
      const postId = req.body.post;
      const isRepeatLike = await Like.findOne({ post: postId, user: userId });
      if (isRepeatLike) {
        return next(appError(400,"你已按過讚"))
      }else{
        const toLike = await Like.create(req.body);
        const toLikeID = toLike._id
        // 然後把按讚推入 該 Post 資料
        await Post.findByIdAndUpdate(toLike.post,{ $push: { likes: toLikeID } },{ new: true });
        res.status(200).json({
            "status":"success",
            data: toLike,
          });
      }
    }else{
      return next(appError(400,"你沒有填寫資料"))
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
    const deletePostId = deleteLike.post;
     // 然後把按讚拉出 該 Post 資料
     await Post.findByIdAndUpdate(deletePostId, { $pull: { likes: id } },{ new: true });
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