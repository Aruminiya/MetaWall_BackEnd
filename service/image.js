const multer = require('multer'); // 引入 multer 模組，用於處理文件上傳
const path = require('path'); // 引入 path 模組，用於處理文件路徑

const upload = multer({ // 創建 multer 的上傳 middleware
    limits: { // 設置上傳限制
      fileSize: 2*1024*1024, // 文件大小上限為 2 MB
    },
    fileFilter(req, file, cb) { // 文件篩選器，用於檢查文件類型
      const ext = path.extname(file.originalname).toLowerCase(); // 取得文件擴展名
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') { // 如果不是指定的圖片格式
        cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。")); // 拋出錯誤
      }
      cb(null, true); // 否則通過篩選
    },
}).any(); // 允許接受任意文件類型的上傳

// multer 詳細介紹
// https://medium.com/麥克的半路出家筆記/筆記-使用-multer-實作大頭貼上傳-ee5bf1683113

module.exports = upload; // 匯出上傳 middleware，使其在其他文件中可引入和使用