const express = require("express");
const { get_Roles } = require("../controllers/role.controller");
const verifyAdmin = require("../middleware/admin_auth");
const verifyToken = require("../middleware/auth");
const role_route = express.Router();

role_route.get('/role/get_Roles',get_Roles)


module.exports = role_route;
