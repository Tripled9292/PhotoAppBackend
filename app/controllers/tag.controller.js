
const { ObjectId } = require('mongodb');
const logger = require('../logger');
const { Tags } = require('../models/tags');
const { Users } = require('../models/users');
const helperFunction = require('../utils/helperFunction');

const addTag = async (req, res) => {
    try {
        const { tag } = req.body;
        const { _id } = req.user;
        let tag_Data = await Tags.findOne({ tag: tag.toLowerCase()}).populate('user','name');
        if (!tag_Data) {
            let data = await Tags({
                tag: tag.toLowerCase(),
                user: _id
            }).save()
            return helperFunction.success(res,"Tag Added Successfully",{tag:data})
        }
        else {
            return helperFunction.success(res, "Tag Already Exists",{tag:tag_Data})
        }

    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

const get_AllTags = async (req, res) => {
    try {
        const data = await Tags.find({is_Deleted:false}).populate('user',{name:1})
        if (data.length > 0) {
            return helperFunction.success(res, "All Tags", { tags: data })
        }
        else return helperFunction.custom(res, 404, "No Tag Found", false)
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const get_Tag = async (req, res) => {
    try {
        let { _id } = req.query;
        let query;
        if(req.user.role!=='admin'){
            query={
                is_Deleted:false,
                _id
            } 
        }
        else{
            query={
                _id
            }
        }
        const data = await Tags.findOne(query).populate('user','name')
        if (data) {
            return helperFunction.success(res, "Tag", { tag: data })
        }
        else return helperFunction.custom(res, 404, "No Tag Found", false)
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const get_UserTags = async (req, res) => {
    try {
      const data = await Tags.aggregate([
        {
          $match: {
            is_Deleted: false,
            user: ObjectId(req.user._id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "created_By",
          },
        },
        {
          $set: {
            created_By: { $arrayElemAt: ["$created_By.name", 0] },
          },
        },
        {
          $project: {
            is_Deleted: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ]);
      if (data.length > 0) {
        return helperFunction.success(res, "User Tag", { tags: data });
      } else return helperFunction.custom(res, 404, "No Tag Found", false);
    } catch (error) {
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
      return helperFunction.serverError(res, "Some Error Is Occurred");
    }
  };
const update_Tag = async (req, res) => {
    try {
        let { _id } = req.query;
        const { tag,is_Deleted } = req.body
        let query
        if(req.user.role!=='admin'){
            query={
                is_Deleted:false,
                _id,
                created_By:req.user._id
            } 
        }
        else{
            query={_id: ObjectId(_id)}
        }
        const data = await Tags.findOneAndUpdate(
            query,
            {
                $set: { tag,is_Deleted  },
                $currentDate: { updatedAt: true },
            },
            {
                returnDocument: 'after'
            }
        )
        if (data) {
            return helperFunction.success(res, "Tag Updated", { tag: data })
        }
        else return helperFunction.custom(res, 404, "No Tag Found", false)
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const search_Get_Tags=async(req,res)=>{
    try {
        let { search } = req.query;
    if (!search) {
        const data = await Tags.find({ is_Delete: false }).limit(5)
        return helperFunction.success(res, "All Tags", { tags: data })
    }
    else if(search){
            let reg1 = []
            let regexp = new RegExp(search, "i");
            reg1.push(regexp)
            const data = await Tags.aggregate([{
                    $project: { tag: 1, _id: 0 }
                },
                { $match: { tag: { $in: reg1 } } },
                
            ])
            return helperFunction.success(res, "Search  Tags", { tags: data })

    }
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

const delete_Tag = async (req, res) => {
    try {
        const { _id } = req.query
        let query;
        if(req.user.role!=='admin'){
            query={
                is_Deleted:false,
                _id: ObjectId(_id),
                created_By:ObjectId(req.user._id)
            } 
        }
        else{
            query={
                _id: ObjectId(_id),
                is_Deleted:false,
            }
        }
        const data = await Tags.updateOne(
            query,
            {
                $set: { is_Deleted: true },
                $currentDate: { updatedAt: true },
            }
        )
        if (data.matchedCount !== 0) {
            return helperFunction.success(res, "Tag Deleted")
        }
        else return helperFunction.custom(res, 404, "Tag Not Found", false)


    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}
const filter_Tag=async(req,res)=>{
    try {
        const {search,to,from,status}=req.query
        let query;
        if(search&&to&&from){
            if(status==='deleted'){
                query = {
                    tag: {"$regex": search, "$options": "i"},
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                    is_Deleted:true
                  };
            }
            else if(status==='is_Active'){
                query = {
                    tag: {"$regex": search, "$options": "i"},
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                    is_Deleted:false
                  };
            }
            else{
                query = {
                    tag: {"$regex": search, "$options": "i"},
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                  };
            }
        }
        else if(to&&from){
            if(status==='deleted'){
                query = {
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                    is_Deleted:true
                  };
            }
            else if(status==='is_Active'){
                query = {
                     "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
                    is_Deleted:false
                  };
            }
            else{
            query = {
                "$and": [{"createdAt":{$gte:ISODate(from)}}, {"createdAt":{$lte:ISODate(to)}}],
             };
            }
       }
        else if(search){
            if(status==='deleted'){
                query = {
                    tag: {"$regex": search, "$options": "i"},
                    is_Deleted:true
                };
            }
            else if(status==='is_Active'){
                query = {
                    tag: {"$regex": search, "$options": "i"},
                    is_Deleted:false
                };
            }
            else{
                query = {
                    tag: {"$regex": search, "$options": "i"},
                  };
            }
            
        }
        else if(status){
            if(status==='deleted'){
                query = {
                    is_Deleted:true
                  };
            }
            else if(status==='is_Active'){
                query = {
                    is_Deleted:false
                  };
            }
            else{
                query = {};
            }
            
        }

        else{
            const data=await Tags.find().populate('user')
             return helperFunction.success(res, "Tags",{tags:data})
        }
        const data=await Tags.find(query).populate('user')
             return helperFunction.success(res, "Tags",{tags:data})
    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res, "Some Error Is Occurred")
    }
}

module.exports = { addTag, get_AllTags,get_Tag , 
    delete_Tag,search_Get_Tags,filter_Tag,update_Tag,get_UserTags }