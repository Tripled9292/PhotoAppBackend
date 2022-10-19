const express = require("express");
const { addPicture, delete_Picture, getPictureById, getPictureByProject, getDocumentByProject, getTopPictureUploader, update_Picture} = require("../controllers/picture.controller");
const verifyToken = require("../middleware/auth");
const { addPictureValidate } = require("../middleware/missingfield.validate");
const upload = require("../middleware/upload");
const picture_route = express.Router();


picture_route.post('/picture/add_Picture',[verifyToken,upload.single("image"),addPictureValidate], addPicture);
picture_route.get('/picture/getPictureById',[verifyToken],getPictureById)
picture_route.put('/picture/update_Picture',[verifyToken],upload.single("image"),update_Picture)
picture_route.get('/picture/getPictureByProject',[verifyToken],getPictureByProject)
picture_route.get('/picture/getDocumentByProject',[verifyToken],getDocumentByProject)
picture_route.delete('/picture/delete_Picture',[verifyToken],delete_Picture)

module.exports = picture_route;

