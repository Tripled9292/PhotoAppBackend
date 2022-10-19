const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    type:{
        type: String,
    },
    user:{
        type:ObjectId,
        ref:"users"
    },
    tags: [
        {
            type: ObjectId,
            ref: "tags",
            required: true
        }
    ],
    isSelected:{
        type:Boolean,
        default:false
    },
    project: {
        type: ObjectId,
        ref: "projects",
        required: true
    },
    device: {
        type: String,
        required: true
    },
    device_path:{
        type: String,
        required: true
    },
    ip_Address:{
        type: String,
        required: true
    },
    is_Deleted: {
        type: Boolean,
        default: false,
    },
    deleted_On: {
        type: Date,
    },
}, {
    timestamps: true
});

//creating collection
const Pictures = new mongoose.model('pictures', PictureSchema)

//export collection
module.exports = { Pictures };