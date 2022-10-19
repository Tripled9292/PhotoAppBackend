const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "users",
        required: true
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
const Tags = new mongoose.model('tags', TagSchema)

//export collection
module.exports = { Tags };