const multer =require('multer');
const  fs =require('fs')
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        const path=`./app/public/users/${req.user._id}/profileImage`
       req.imagePath = `/users/${req.user._id}/profileImage/${file.originalname}`
       fs.mkdirSync(path, { recursive: true })
        cb(null,path)
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload =multer({storage:storage})

module.exports = upload;