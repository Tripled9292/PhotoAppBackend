const express = require("express");
const { register, send_Otp,login,resetPasswordRequest,
    get_Users,get_UserAccount, update_UserAccount,
    delete_UserAccount,resetPassword, filter_User, changePassword, getTopPictureUploader, getTopDocumentUploader, imageUpload} = require("../controllers/users.controller");
const verifyAdmin = require("../middleware/admin_auth");
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/dpupload");
const { resetPasswordValidate, loginValidate, registerValidate, OTPValidate, update_UserAccountValidate, changePasswordValidate } = require("../middleware/missingfield.validate");
const {verification} = require("../middleware/otp.verify");
const { checkDuplicateEmail } = require("../middleware/sign.validate");

const user_route = express.Router();

user_route.post('/user/send_Otp',OTPValidate,send_Otp);
user_route.post('/user/register',[registerValidate,checkDuplicateEmail], register);
user_route.post('/user/login',loginValidate, login);
user_route.post('/user/resetPasswordRequest',resetPasswordRequestValidate, resetPasswordRequest);
user_route.get('/user/get_Users',[verifyToken,verifyAdmin], get_Users);
user_route.get('/user/get_UserAccount', get_UserAccount);
user_route.post('/user/imageUpload',[verifyToken,upload.single("image")], imageUpload);
user_route.put('/user/update_UserAccount',[verifyToken,update_UserAccountValidate], update_UserAccount);
user_route.put('/user/resetPassword',[resetPasswordValidate,verification], resetPassword);
user_route.put('/user/changePassword',[changePasswordValidate,verifyToken], changePassword);
user_route.delete('/user/delete_UserAccount',[verifyToken,verifyAdmin], delete_UserAccount);
user_route.get('/user/filter_User',[verifyToken,verifyAdmin], filter_User);
user_route.get('/user/getTopPictureUploader',[verifyToken],getTopPictureUploader)
user_route.get('/user/getTopDocumentUploader',[verifyToken],getTopDocumentUploader)


module.exports = user_route;

