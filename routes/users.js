const express = require('express');
const router = express.Router();
const User = require("../models/userModel.js");
const handleError = require('../handleError.js');
const handleSuccess = require('../handleSuccess.js');

// 取得使用者
router.get('/',async function(req, res, next) {
    try{   
        const getUser = await User.find(req.query);
        handleSuccess(res, getUser);
    }catch(err){
        handleError(res, err, "取得使用者資料失敗");
    }
});

// 新增使用者
router.post('/',async function(req, res, next) {
    try{
        const postUser = await User.create(req.body);
        handleSuccess(res, postUser);
    }catch(err){
        handleError(res, err, "資料傳輸或建立失敗");
    }
});

// 刪除所有使用者
router.delete('/',async function(req, res, next) {
    try{
        await User.deleteMany({});
        handleSuccess(res, []);
    }catch(err){
        handleError(res, err, "刪除所有使用者資料失敗");
    }
});

// 刪除單一使用者
router.delete('/:id',async function(req, res, next) {
    try{
        const { id } = req.params
        const deleteUser = await User.findByIdAndDelete(id);
        handleSuccess(res, deleteUser);
    }catch(err){
        handleError(res, err, "刪除單一使用者資料失敗");
    }
});

// 編輯單一使用者
router.patch('/:id',async function(req, res, next) {
    try{
        const { id } = req.params
        const editUser = await User.findByIdAndUpdate(id,req.body,{ new: true });
        handleSuccess(res, editUser);
    }catch(err){
        handleError(res, err, "編輯單一使用者資料失敗");
    }
});

module.exports = router;
