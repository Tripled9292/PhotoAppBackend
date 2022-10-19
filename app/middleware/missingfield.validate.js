const logger = require("../logger");
const helperFunction  = require("../utils/helperFunction");
// User Validation
loginValidate = (req, res, next) => {
    try {
        if (!req.body.email) {
            return helperFunction.validationError(res,"Invalid Request,Email Is Required")
        }
        if (!req.body.password) {
            return helperFunction.validationError(res,"Invalid Request,Password Is Required")
        }
        next();
    } catch (error) {
       logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
       return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
resetPasswordRequestValidate = (req, res, next) => {
    try {
        if (!req.body.email) {
            return helperFunction.validationError(res,"Invalid Request,Email Is Required")
        }
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
resetPasswordValidate = (req, res, next) => {
    try {
        if (!req.body.password) {
            return helperFunction.validationError(res,"Invalid Request,Password Is Required")
        }
        if (!req.body.email) {
            return helperFunction.validationError(res,"Invalid Request,Email Is Required")
        }
        if (!req.body.otp_Code) {
            return helperFunction.validationError(res,"Invalid Request,Otp Is Required")
        }
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
changePasswordValidate = (req, res, next) => {
    try {
        if (!req.body.password) {
            return helperFunction.validationError(res,"Invalid Request,Password Is Required")
        }
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
registerValidate= (req, res, next) => {
    try {
        if (!req.body.email) {
            return helperFunction.validationError(res,"Invalid Request,Email Is Required")
        }
        if (!req.body.password) {
            return helperFunction.validationError(res,"Invalid Request,Password Is Required")
        }
        if (!req.body.name) {
            return helperFunction.validationError(res,"Invalid Request,Name Is Required")
        }
        // if (!req.body.phone) {
        //     return helperFunction.validationError(res,"Invalid Request,Phone Number Is Required")
        // }
        // if (!req.body.otp_Code) {
        //     return helperFunction.validationError(res,"Invalid Request,OTP Is Required")
        // }
        
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
OTPValidate = (req, res, next) => {
    try {
        if (!req.body.email) {
            return helperFunction.validationError(res,"Invalid Request,Email Is Required")
           
        }
       
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
update_UserAccountValidate = (req, res, next) => {
    try {
        if (req.body.email==''||null) {
            return helperFunction.validationError(res,"Invalid Request, Email Cannot Empty") 
        }
        if (req.body.name==''||null) {
            return helperFunction.validationError(res,"Invalid Request, Name Cannot Empty") 
        }
        // if (req.body.phone==''||null) {
        //     return helperFunction.validationError(res,"Invalid Request, Phone Cannot Empty") 
        // // }
        // if (req.body.designation==''||null) {
        //     return helperFunction.validationError(res,"Invalid Request, Designation Cannot Empty") 
        // }
       
        next();
    } catch (error) {
       logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
       return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
// Project Validation
addProjectValidate = (req, res, next) => {
    try {
        if (!req.body.name) {
            return helperFunction.validationError(res,"Invalid Request,Project Name Is Required")
        }
       
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
updateProjectValidate = (req, res, next) => {
    try {
        if (req.body.name==''||null) {
            return helperFunction.validationError(res,"Invalid Request,Project Name Cannot Empty")
        }
       
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
// Tag Validation
addTagValidate = (req, res, next) => {
    try {
        if (!req.body.tag) {
            return helperFunction.validationError(res,"Invalid Request,Tag Is Required")
        }
       
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}
updateTagValidate = (req, res, next) => {
    try {
        if (req.body.tag===''||null) {
            return helperFunction.validationError(res,"Invalid Request,Tag Cannot Empty")
        }
       
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}

// Picture Validation
addPictureValidate = (req, res, next) => {
    try {
        if (!req.body.name) {
            return helperFunction.validationError(res,"Invalid Request,File Name Is Required")
        }
        if (!req.body.project) {
            return helperFunction.validationError(res,"Invalid Request,Project Is Required")
        }
        if(!req.body.device_path){
            return helperFunction.validationError(res,"Invalid Request,Device Path Is Required")
        }
        next();
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred",error)
    }
}

const validate = {
    loginValidate,resetPasswordRequestValidate,resetPasswordValidate,
    registerValidate, OTPValidate,update_UserAccountValidate,addProjectValidate,
    updateProjectValidate,addTagValidate,addPictureValidate,changePasswordValidate,
    updateTagValidate
};

module.exports = validate;