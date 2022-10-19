const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    otp_Code: {
        type: String,
        required:true
    },
    expireIn: {
        type: Number
    },
    is_verified: {
        type: Boolean
    },
},{
    timestamps: true
});

//creating collection
const Otp = new mongoose.model('otp', OtpSchema)

//export collection
module.exports = { Otp };