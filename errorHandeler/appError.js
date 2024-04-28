const appError = (httpStatus,errMessage)=>{
    //利用 next 要吐給 express 錯誤的話 要用 錯誤建構子 的形式
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    return error;
}


module.exports = appError;