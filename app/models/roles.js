const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        trim: true
    }
})

const Roles = new mongoose.model('roles', RoleSchema)

//export collection
module.exports = { Roles };