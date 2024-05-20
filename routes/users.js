const express = require('express');
const router = express.Router();
const User = require("../models/userModel.js");
const appError = require('../service/appError.js');
const handleErrorAsync = require('../service/handleErrorAsync.js');
const { isAuth, generateSendJWT } = require('../service/auth.js');


// bcrypt 密碼加密
const bcrypt = require('bcryptjs');
// validator 驗證
const validator = require('validator');

// 取得使用者
router.get('/',handleErrorAsync(
    async function(req, res, next) {
    const getUser = await User.find(req.query);
    res.status(200).json({
        "status":"success",
        data: getUser
    });
}
));

// 使用者註冊
router.post('/sign_up',handleErrorAsync(
    async function(req, res, next) {
        // 取的傳入的 body 帳密後把密碼加密
        const { name, email, sex, password } = req.body;

        // 錯誤回饋
        if(validator.isEmpty(name)){return next(appError(400,"姓名不得為空"))};
        if(!validator.isLength(password,{ min: 8 })){return next(appError(400,"密碼需要 8 碼以上"))};
        if(!validator.isEmail(email)){return next(appError(400,"Email 格式不正確"))};
        if(!validator.isIn(sex, ["male","female","other"])){return next(appError(400,"不存在的性別模式"))};

        req.body.password = await bcrypt.hash(password,12);

        const postUser = await User.create(req.body);
        generateSendJWT(postUser,200,res);
    }
));

// 使用者登入
router.post('/sign_in',handleErrorAsync(
    async function(req, res, next) {
        const { email, password } = req.body;

        if(!validator.isLength(password,{ min: 8 })){return next(appError(400,"密碼需要 8 碼以上"))};
        if(!validator.isEmail(email)){return next(appError(400,"Email 格式不正確"))};


        /*在 Mongoose 中，.select('+password') 用于查询文档时指示返回结果中包含指定字段。在这种情况下，+password 意味着要返回文档中的 password 字段，即使在模型定义中该字段被设置为不选择 (select: false)。
        通常情况下，为了安全起见，用户的密码字段通常会被设置为不选择，以防止在查询用户信息时返回密码。但是，有时在某些情况下（例如用户登录）可能需要获取用户密码，以便进行密码验证。
        所以，.select('+password') 的使用场景通常是在需要获取用户密码的情况下。在您的示例中，getUser 是一个查询结果，包含了给定邮箱的用户信息，并且返回的结果中包括用户的密码字段。*/
        const getUser = await User.findOne({ email }).select('+password');
        //驗證帳號對不對
        if(!getUser){return next(appError(400,"找不到該 Email"))};
        //驗證密碼對不對
        const passwordCompare = await bcrypt.compare(password, getUser.password);
        if(passwordCompare){
            generateSendJWT(getUser,200,res);
        }else{
            return next(appError(400,"密碼不正確"))
        }
    }
));


// 驗證使用者登入狀態
router.post('/check', isAuth, (req, res) => {
    // 如果執行到這裡，表示 token 是有效的
    // 你可以執行任何與檢查登入狀態相關的操作
    res.status(200).json({ 
        "success": true,
        message: '用戶已經通過驗證',
        user: req.user
    });
});

// 刪除所有使用者
router.delete('/deleteAll',handleErrorAsync(
    async function(req, res, next) {
        await User.deleteMany({});
        res.status(200).json({
            "status":"success",
            data: []
        });
    }
));

// 刪除單一使用者
router.delete('/:id',handleErrorAsync(
    async function(req, res, next) {
        const { id } = req.params;
        const deleteUser = await User.findByIdAndDelete(id);
        if(deleteUser){
            res.status(200).json({
              "status":"success",
              data: deleteUser
            });
          }else{
            return next(appError(400,"找不到該刪除資料"))
          }
    }
));

// 編輯單一使用者 
router.patch('/:id',handleErrorAsync(
    async function(req, res, next) {
        const { id } = req.params;
        const reqBody = req.body;
        
        // 如果有修改密碼 要加密
        if (reqBody.password){
            if(!validator.isLength(reqBody.password,{ min: 8 })){return next(appError(400,"密碼需要 8 碼以上"))};
            reqBody.password = await bcrypt.hash(reqBody.password,12);
        };
        // 如果有要修改追蹤朋友或追蹤者資料的話 提示請去使用別的 API 
        // 因為這之 API 只能修改單一使用者 
        // 而追蹤功能 需要同時修改追蹤者與被追蹤者的資料
        if (reqBody.follower || reqBody.following) {
            return next(appError(400,"不能在此修該追蹤資料 請使用 {userID}/follow 這支 API 修改"))
        }
        

        const editUser = await User.findByIdAndUpdate(id,reqBody,{ new: true });
        if(editUser){
            res.status(200).json({
              "status":"success",
              data: editUser
            });
          }else{
            return next(appError(400,"找不到該編輯資料"))
          }
    }
));

// 使用者追蹤他人
router.patch('/:userId/follow',handleErrorAsync(
    async function(req, res, next) {
        const { userId } = req.params;
        const userfollowingId = req.body.following;

        // 检查是否已经在追踪名单中
        const user = await User.findById(userId);

        if (!user) {
            return next(appError(400, "用戶不存在"));
        }
        if (user.following.includes(userfollowingId)) {
            return next(appError(400, "已經在追蹤名單中"));
        }

        // 先更新追蹤者的 追蹤名單
        const editUserFollowing = await User.findByIdAndUpdate(userId,{ $push: { following: userfollowingId } },{ new: true });

        // 再更新被追蹤者的被追蹤名單
        const editFollowerId = await User.findByIdAndUpdate(userfollowingId,{ $push: { follower: userId } },{ new: true });

        if(editUserFollowing && editFollowerId ){
            res.status(200).json({
              "status":"success",
              following: editUserFollowing,
              follower: editFollowerId
            });
          }else{
            return next(appError(400,"找不到該編輯資料"))
          }
    }
));

// 使用者不追蹤他人
router.patch('/:userId/unfollow',handleErrorAsync(
    async function(req, res, next) {

        // 先更新追蹤者的 追蹤名單
        const { userId } = req.params;
        const userfollowingId = req.body.following;

        
        // 检查是否已经在追踪名单中
        const user = await User.findById(userId);
        if (!user) {
            return next(appError(400, "用戶不存在"));
        }
        if (!user.following.includes(userfollowingId)) {
            return next(appError(400, "使用者不在追蹤名單中"));
        }

        const editUserFollowing = await User.findByIdAndUpdate(userId,{ $pull: { following: userfollowingId } },{ new: true });

        // 再更新被追蹤者的被追蹤名單
        const editFollowerId = await User.findByIdAndUpdate(userfollowingId,{ $pull: { follower: userId } },{ new: true });

        if(editUserFollowing && editFollowerId ){
            res.status(200).json({
              "status":"success",
              following: editUserFollowing,
              follower: editFollowerId
            });
          }else{
            return next(appError(400,"找不到該編輯資料"))
          }
    }
));

module.exports = router;
