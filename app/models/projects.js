const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    project_id:{
        type:String
    },
    name: {
        type: String,
        required: true
    },
    created_By:{
        type: ObjectId,
        ref: "users",
        required: true
    },
    is_Active:{
        type: Boolean,
        default: true,
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
});

//creating collection
const Projects = new mongoose.model('projects', ProjectSchema)

//export collection
module.exports = { Projects };