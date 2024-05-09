const jwt = require('jsonwebtoken');
const appError = require('../errorHandeler/appError.js');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(appError(400,"未授權 沒有提供 token"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(appError(400,"未授權 無效的 token"));
        }
        // 把 token 解析的 id 給 req 去承接
        req.userId = decoded.id;
        next();
    });
};

module.exports = authenticateToken;
