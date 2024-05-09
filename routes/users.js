const express = require('express');
const router = express.Router();
const User = require("../models/userModel.js");
const appError = require('../errorHandeler/appError.js');
const handleErrorAsync = require('../errorHandeler/handleErrorAsync.js');
const authenticateToken = require('../middleware/authenticateToken.js');


// bcrypt 密碼加密
const bcrypt = require('bcryptjs');
// validator 驗證
const validator = require('validator');
// JWT
const jwt = require('jsonwebtoken');


// 回傳 JWT 設定
const generateSendJWT = (user, statusCode, res)=>{
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_DAY
    });
    // 密碼不能被包進 payload 裡面
    user.password = undefined;
    res.status(statusCode).json({
        "status":"success",
        data: user,
        token
    })
}

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
router.post('/signUp',handleErrorAsync(
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
router.post('/logIn',handleErrorAsync(
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
router.post('/check', authenticateToken, (req, res) => {
    // 如果執行到這裡，表示 token 是有效的
    // 你可以執行任何與檢查登入狀態相關的操作
    res.status(200).json({ 
        "success": true,
        message: '用戶已經通過驗證',
        userId: req.userId
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
        const editUser = await User.findByIdAndUpdate(id,req.body,{ new: true });
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

module.exports = router;
