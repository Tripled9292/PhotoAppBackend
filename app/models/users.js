const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        // required: true,
        // unique: true
    },
    
    image: {
        type: String,
        default: 'https://res.cloudinary.com/zeeatriom/image/upload/v1633337112/Amems/128-1280406_view-user-icon-png-user-circle-icon-png_drx9ja.jpg'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role:{
        type:ObjectId,
        ref:'roles',
        default:'62baa26700406999b9dec2de'
    },
    last_Login_Time:{
        type: Date,
    },
    last_Login_IP:{
        type: String,
    },
    is_Deleted: {
        type: Boolean,
        default: false,
    },
    deleted_On: {
        type: Date,
    },

},{
    timestamps: true
})

const Users = new mongoose.model('users', UserSchema)
//export collection
module.exports = { Users};