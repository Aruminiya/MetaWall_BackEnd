const handleError = (res, err, message) => {
    res.status(400).json({
        "status":"error",
        "message":message,
        "errors": err
        })
}
module.exports = handleError;