const jwt = require("jsonwebtoken");
const logger = require("../logger");
const helperFunction  = require("../utils/helperFunction");
const config = process.env;
const verifyToken = (req, res, next) => {
    const token =req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return helperFunction.authError(res,"A Token Is Required For Authentication")
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
        if(req.user.role==='62baa24f00406999b9dec2dd'){
            req.user.role='admin'
        }
        else{
            req.user.role='user'
        }
        
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.authError(res, "Token Is Invalid")
        
    }
    return next();
}

module.exports = verifyToken;