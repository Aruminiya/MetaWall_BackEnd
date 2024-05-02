const express = require('express');
const router = express.Router();
const User = require("../models/userModel.js");
const appError = require('../errorHandeler/appError.js');
const handleErrorAsync = require('../errorHandeler/handleErrorAsync.js');

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

// 新增使用者
router.post('/',handleErrorAsync(
    async function(req, res, next) {
        const postUser = await User.create(req.body);
        res.status(200).json({
            "status":"success",
            data: postUser
        });
    }
));

// 刪除所有使用者
router.delete('/',handleErrorAsync(
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
        const { id } = req.params
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
        const { id } = req.params
        const editUser = await User.findByIdAndUpdate(id,req.body,{ new: true });
        console.log(editUser);
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
