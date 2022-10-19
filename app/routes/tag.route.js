const express = require("express");
const { get_AllTags,addTag,delete_Tag, search_Get_Tags, filter_Tag, get_Tag, update_Tag, get_UserTags,} = require("../controllers/tag.controller");
const verifyAdmin = require("../middleware/admin_auth");
const verifyToken = require("../middleware/auth");
const { addTagValidate, updateTagValidate } = require("../middleware/missingfield.validate");
const tag_route = express.Router();
tag_route.get('/tag/get_AllTags',[verifyToken],get_AllTags)
tag_route.get('/tag/get_Tag',[verifyToken],get_Tag)
tag_route.get('/tag/get_UserTags',[verifyToken],get_UserTags)
tag_route.post('/tag/add_Tag',[verifyToken,addTagValidate], addTag);
tag_route.put('/tag/update_Tag',[verifyToken,updateTagValidate], update_Tag);
tag_route.delete('/tag/delete_Tag',[verifyToken,verifyAdmin], delete_Tag);
tag_route.get('/tag/search_Get_Tags',verifyToken,search_Get_Tags)
tag_route.get('/tag/filter_Tag',verifyToken,filter_Tag)



module.exports = tag_route;

