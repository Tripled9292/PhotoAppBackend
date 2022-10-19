const logger = require("../logger");
const { Users } = require("../models/users");
const helperFunction  = require("../utils/helperFunction");

checkDuplicateEmail = async(req, res, next) => {
    try {
        let email = await Users.findOne({
            email: req.body.email
        })
        if (email) {
            return helperFunction.badRequest(res,"This Email is already exits")
        }
        // let phone = await Users.findOne({
        //     phone: req.body.phone
        // })
        // if (phone) {
        //     return helperFunction.badRequest(res,"This Phone Number is already exits")
        // }
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred")
    }
}

const DuplicateEmail= {
    checkDuplicateEmail
};

module.exports = DuplicateEmail;