const logger = require("../logger");
const { Otp } = require("../models/otp");
const helperFunction  = require("../utils/helperFunction");

verification = async(req, res, next) => {
    try {
        var date = new Date().getTime() / 1000;
        let data = await Otp.findOne({
            email: req.body.email,
            is_verified: false,
            otp_Code: req.body.otp_Code,
            expireIn: { $gte: date }
        })
        
        if (data) {
             await Otp.updateOne({
                _id: data._id
            }, {
                is_verified: true
            })
           
        } else {
            return helperFunction.badRequest(res,"OTP not verified")
        }
        next()
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,401,"Some Error Occurred",false,error)
    }

}
const verify = {
    verification: verification,
};

module.exports = verify;