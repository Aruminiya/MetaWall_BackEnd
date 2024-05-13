const jwt = require('jsonwebtoken');
const appError = require('./appError.js');
const handleErrorAsync = require('./handleErrorAsync');
const User = require("../models/userModel.js");

// 權限驗證
const isAuth = handleErrorAsync(async (req, res, next) => {
    // 確認 token 是否存在
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(appError(400,"未授權 沒有提供 token"));
    }

    // 驗證 token 正確性
    const decoded = await new Promise((resolve,reject)=>{
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                reject(err)
            }else{
                resolve(payload)
            }
        });
    });
    const currentUser = await User.findById(decoded.id);


    req.user = currentUser;
    next();
});





//產生 JWT
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

module.exports = {
    isAuth,
    generateSendJWT
}
