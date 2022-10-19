const logger = require("../logger")
const { Roles } = require("../models/roles")
const  helperFunction  = require('../utils/helperFunction');


const get_Roles = async (req, res) => {
    try {
        const data = await Roles.find({ is_Delete: false }, { is_Delete: 0 })
        if (data.length > 0) {
            return helperFunction.success(res, "All Roles", { roles: data })
        }
        else return helperFunction.custom(res, 404, "No Role Found", false)
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

module.exports = {get_Roles}