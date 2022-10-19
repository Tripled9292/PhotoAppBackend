const jwt = require("jsonwebtoken");
const { Users } = require("../models/users");
var { ObjectId } = require('mongodb');
const helperFunction  = require("../utils/helperFunction");
const logger = require("../logger");
const verifyAdmin = async(req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return helperFunction.authError(res, "A Token Is Required For Authentication")
    }
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;
            var userId = ObjectId(req.user._id)
            const data = await Users.aggregate([
                { $match: { _id: userId } },
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "roles"
                    }
                   
                }, 
                {$unwind : '$roles'},
                {
                    $project: {
                     _id:0,  role:"$roles.role"
                    }
                 }
            ])
            if (data[0].role === "admin") {
                return next();
            } else {
                return helperFunction.authError(res,"Sorry Access Denied")
            }
        } catch (err) {
            logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
            return helperFunction.authError(res, "Token Is Invalid")
        }

    }

}

module.exports = verifyAdmin;