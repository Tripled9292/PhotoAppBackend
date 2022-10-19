const express = require("express");
const { addProject, get_AllProjects,get_Project,delete_Project,get_UserProject,filterProject, update_Project, get_UserProject2 } = require("../controllers/project.controller");
const verifyAdmin = require("../middleware/admin_auth");
const verifyToken = require("../middleware/auth");
const { addProjectValidate, updateProjectValidate } = require("../middleware/missingfield.validate");
const project_route = express.Router();

project_route.get('/project/get_AllProjects',[verifyToken,verifyAdmin], get_AllProjects);
project_route.get('/project/get_Project',[verifyToken], get_Project);
project_route.get('/project/get_UserProject',[verifyToken], get_UserProject);
project_route.get('/project/v2/get_UserProject',[verifyToken], get_UserProject2);
project_route.put('/project/update_Project',[verifyToken,updateProjectValidate], update_Project);
project_route.get('/project/filterProject',[verifyToken], filterProject);
project_route.post('/project/add_Project',[verifyToken,addProjectValidate], addProject);
project_route.delete('/project/delete_Project',[verifyToken], delete_Project );



module.exports = project_route;

