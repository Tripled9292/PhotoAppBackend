const { Users } = require("../models/users")
const { Otp } = require("../models/otp")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const  helperFunction  = require('../utils/helperFunction');
const { ObjectId } = require("mongodb");
const { Roles } = require("../models/roles");
const logger = require("../logger");
const ISODate =require('isodate')
require('dotenv').config()
var smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const sendMail = require("../utils/sendMail");

const send_Otp = async (req, res) => {
    try {
        // let otp_Code = Math.floor((Math.random() * 10000) + 1);
        let datetime = new Date().getTime() / 1000 + 300

        let otp = await Otp.findOne({
            phone: req.body.phone,
            is_verified: false,

        })
        if (otp) {
            let data = await Otp.findOne({
                phone: req.body.phone,
                is_verified: false,
            })
            if (data) {
                await Otp.updateOne({
                    _id: data._id
                }, {
                    otp_Code: '0000',
                    expireIn: datetime
                })
                return helperFunction.success(res, "OTP Has Been Resend To Customer Phone Number")
            }
        }
        else {
            await new Otp({
                phone: req.body.phone,
                otp_Code: '0000',
                expireIn: datetime,
                is_verified: false
            }).save()

            return helperFunction.success(res,"OTP Has Been Sent To Customer Phone Number")
        }
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

const register = async (req, res) => {
    try {
        const user = new Users(req.body)
        let encryptedPassword = await bcrypt.hash(user.password, 10);
        user.email=req.body.email.toLowerCase()
        user.password = encryptedPassword;
        user.last_Login_Time=Date.now()
        let ip= req.ip.replace('::ffff:', '')
        user.last_Login_IP=ip
        // user.role=ObjectId("62baa26700406999b9dec2de")
         await user.save();
        const token = jwt.sign({ email: user.email, _id: user._id },
            process.env.TOKEN_KEY
        )
        let obj = {
            name: req.body.name,
            token: token
        }
        return helperFunction.success(res, "Your Account Has Been Register Successfully",obj)
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let ip= req.ip.replace('::ffff:', '')
        const user = await Users.findOne({ email:email.toLowerCase(),is_Deleted:false } );
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ _id: user._id, email: user.email,role:user.role},
                process.env.TOKEN_KEY
            );
            await Users.updateOne(
                { _id: user._id },
                {
                    $set: { last_Login_Time: Date.now(),last_Login_IP:ip},
                    $currentDate: { updatedAt: true },
                }
            )
            let obj = {
                name: user.name,
                image:user.image,
                email:user.email,
                token: token
            }
            
            return helperFunction.success(res, "Login Successful", obj)
        }
        else {
            return helperFunction.authError(res, "Invalid Credentials")
        }

    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({email:email.toLowerCase() })
        if (user) {
           let otp_Code = Math.random().toString().substr(2, 4);
            let datetime = new Date().getTime() / 1000 + 300
            await new Otp({
                email: email,
                otp_Code: otp_Code,
                expireIn: datetime,
                is_verified: false
            }).save()
             sendMail(req,res,email,otp_Code)
            
        
        }
        else{
            return helperFunction.badRequest(res, "Email is Incorrect")
        }
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred",error)
    }
}



const get_Users = async (req, res) => {
    try {
        const data = await Users.find({ is_Deleted: false }, { password: 0, is_Deleted: 0, __v: 0 })
        .populate({ path: 'role', model: Roles })
     
        return helperFunction.success(res, "All Users",{users: data})
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

const get_UserAccount = async (req, res) => {
    try {
        const { _id }=req.query
        const data = await Users.findOne({
            _id
        }, { password: 0, __v: 0 }).populate('role')
        if(data){
            return helperFunction.success(res, "User Account",{user: data})
        }
        else  return helperFunction.custom(res, 404, "User Not Found", false)

    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const imageUpload=async (req,res)=>{
    try {
        console.log("image")
        var imagePath = req.imagePath;
        return helperFunction.success(res, "Image Uploaded",{imagePath})
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const update_UserAccount = async (req, res) => {
    try {
        const { name, email, phone, image,role,is_Deleted } = req.body;
        const { _id } = req.query
        const data = await Users.findOneAndUpdate(
            { _id },
            {
                $set: { name, email, phone,image,role,is_Deleted },
                $currentDate: { updatedAt: true },
            },
            {
                returnDocument: 'after'
            }
        )
        if (data) {
            return helperFunction.success(res, "User Account Updated")
        }
        else return helperFunction.custom(res, 404, "User Not Found", false)
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const delete_UserAccount = async (req, res) => {
    try {
        const { _id } = req.query
        const data = await Users.updateOne(
            { _id, is_Deleted: false },
            {
                $set: { is_Deleted: true },
                $currentDate: { updatedAt: true },
            }
        )
        if (data.matchedCount !== 0) {
            return helperFunction.success(res, "User Account Deleted")
        }
        else return helperFunction.custom(res, 404, "User Not Found", false)


    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const resetPassword=async(req,res)=>{
    try {
        const {email,otp}=req.body
        var password = req.body.password
        var encryptedPassword = await bcrypt.hash(password, 10);
        await Users.updateOne({
           email
        }, {
            password: encryptedPassword
        });
        return helperFunction.success(res, "Password Change Successfully")
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

const changePassword=async(req,res)=>{
    try {
        const {password}=req.body
        const { _id } = req.user
        var encryptedPassword = await bcrypt.hash(password, 10);
        await Users.updateOne({
            _id
         }, {
             password: encryptedPassword
         });
         return helperFunction.success(res, "Password Change Successfully")

    } catch (error) {
         logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

const filter_User=async(req,res)=>{
    try {
        const {search,to,from,status}=req.query
        let query;
        if(search&&to&&from){
            if(status==='deleted'){
                query = {
                    "$or": [{"name": {"$regex": search, "$options": "i"}}, {"email": {"$regex": search, "$options": "i"}}],
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                    is_Deleted:true,
                    role:'62baa26700406999b9dec2de'
                  };
            }
            else if(status==='is_Active'){
                query = {
                    "$or": [{"name": {"$regex": search, "$options": "i"}}, {"email": {"$regex": search, "$options": "i"}}],
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                    is_Deleted:false,
                    role:'62baa26700406999b9dec2de'
                  };
            }
            else{
                query = {
                    "$or": [{"name": {"$regex": search, "$options": "i"}}, {"email": {"$regex": search, "$options": "i"}}],
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                     role:'62baa26700406999b9dec2de'
                  };
            }
        }
        else if(to&&from){
            if(status==='deleted'){
                query = {
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                    is_Deleted:true,
                    role:'62baa26700406999b9dec2de'
                  };
            }
            else if(status==='is_Active'){
                query = {
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                    is_Deleted:false,
                    role:'62baa26700406999b9dec2de'
                  };
            }
            else{
            query = {
               "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
               role:'62baa26700406999b9dec2de',
             };
            }
       }
        else if(search){
            if(status==='deleted'){
                query = {
                    "$or": [{"name": {"$regex": search, "$options": "i"}}, {"email": {"$regex": search, "$options": "i"}}],
                    is_Deleted:true,
                    role:'62baa26700406999b9dec2de'
                };
            }
            else if(status==='is_Active'){
                query = {
                    "$or": [{"name": {"$regex": search, "$options": "i"}}, {"email": {"$regex": search, "$options": "i"}}],
                    is_Deleted:false,
                    role:'62baa26700406999b9dec2de'
                };
            }
            else{
                query = {
                    "$or": [{"name": {"$regex": search, "$options": "i"}}, {"email": {"$regex": search, "$options": "i"}}],
                    role:'62baa26700406999b9dec2de'
                  };
            }
            
        }
        else if(status){
            if(status==='deleted'){
                query = {
                    is_Deleted:true,
                    role:'62baa26700406999b9dec2de'
                  };
            }
            else if(status==='is_Active'){
                query = {
                    is_Deleted:false,
                    role:'62baa26700406999b9dec2de'
                    
                  };
            }
            else{
                query = {role:'62baa26700406999b9dec2de'};
            }
            
        }

        else{
            const data=await Users.find({role:'62baa26700406999b9dec2de'})
             return helperFunction.success(res, "Users",{users:data})
        }
        const data=await Users.find(query)
             return helperFunction.success(res, "Users",{users:data})
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const getTopPictureUploader=async(req,res)=>{

    try {
        let query={is_Deleted:false,role:ObjectId('62baa26700406999b9dec2de')}
        let data =await Users.aggregate([
            { $match: query },
            {
                $lookup:{
                    from:'pictures',
                    localField:'_id',
                    foreignField:'user',
                    pipeline: [ 
                        { $match:
                          {
                            "type": "picture",
                          }
                       },
                       ],
                      as: "pictures_count",
                    },
                  },
                  
                { $addFields: { pictures_count: { $size: "$pictures_count" } } },
                  { $project: { "name": 1, "pictures_count": 1,} }
            
        ]).sort({pictures_count:-1}).limit(10)
        return helperFunction.success(res, "Top 10 Pictures Uploader", { users: data })
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const getTopDocumentUploader=async(req,res)=>{

    try {
        let query={is_Deleted:false,role:ObjectId('62baa26700406999b9dec2de')}
        let data =await Users.aggregate([
            { $match: query },
            
                  {
                    $lookup:{
                    from:'pictures',
                    localField:'_id',
                    foreignField:'user',
                    pipeline: [ 
                        { $match:
                          {
                            "type": "document",
                          }
                       },
                       ],
                      as: "documents_count",
                    }
                },
                  { $addFields: { documents_count: { $size: "$documents_count" } } },
                  { $project: { "name": 1,"documents_count":1} }
            
        ]).sort({documents_count:-1}).limit(10)
        return helperFunction.success(res, "Top 10 Document Uploader", { users: data })
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}


module.exports = {
    register, send_Otp, login, resetPasswordRequest,imageUpload,
    get_Users, get_UserAccount, update_UserAccount, delete_UserAccount,resetPassword,
    filter_User,changePassword,getTopPictureUploader,getTopDocumentUploader
}
