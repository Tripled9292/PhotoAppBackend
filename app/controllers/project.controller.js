const { ObjectId } = require("mongodb");
const logger = require("../logger");
const { Projects } = require("../models/projects");
const { Pictures } = require("../models/pictures");
const helperFunction = require("../utils/helperFunction");
const ISODate = require("isodate");
const moment = require("moment");

const addProject = async (req, res) => {
  try {
    const { name } = req.body;
    const { _id } = req.user;
    let data = await Projects({
      name,
      created_By: ObjectId(_id),
    }).save();
    return helperFunction.success(res, "Project Added Successfully", {
      project: data,
    });
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};

const get_AllProjects = async (req, res) => {
  try {
    const data = await Projects.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "created_By",
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
          __v: 0,
        },
      },
    ]);
    if (data.length > 0) {
      return helperFunction.success(res, "All Projects", { projects: data });
    } else return helperFunction.custom(res, 404, "No Project Found", false);
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};
const get_Project = async (req, res) => {
  try {
    const { _id } = req.query;
    let query;
    if (req.user.role !== "admin") {
      query = {
        is_Deleted: false,
        _id: ObjectId(_id),
        created_By: ObjectId(req.user._id),
      };
    } else {
      query = { _id: ObjectId(_id) };
    }

    const data = await Projects.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "users",
          localField: "created_By",
          foreignField: "_id",
          as: "created_By",
        },
      },
      {
        $set: {
          created_By: { $arrayElemAt: ["$created_By.name", 0] },
        },
      },
    ]);
    if (data.length > 0) {
      return helperFunction.success(res, "Project", { project: data[0] });
    } else return helperFunction.custom(res, 404, "No Project Found", false);
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};
const update_Project = async (req, res) => {
  try {
    let query;
    let { _id } = req.query;
    const { name,is_Deleted, is_Active } = req.body;
    if (req.user.role !== "admin") {
      query = {
        is_Deleted: false,
        _id: ObjectId(_id),
        created_By: ObjectId(req.user._id),
      };
    } else {
      query = { _id: ObjectId(_id) };
    }
    const data = await Projects.findOneAndUpdate(
      query,
      {
        $set: { name, is_Deleted, is_Active },
        $currentDate: { updatedAt: true },
      },
      {
        returnDocument: "after",
      }
    ).populate("created_By", { name: 1, _id: 0 });
    if (data) {
      return helperFunction.success(res, "Project Updated", { project: data });
    } else return helperFunction.custom(res, 404, "No Project Found", false);
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};

const get_UserProject = async (req, res) => {
  try {
    const data = await Projects.aggregate([
      {
        $match: {
          is_Deleted: false,
          created_By: ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_By",
          foreignField: "_id",
          as: "created_By",
        },
      },

      {
        $lookup: {
          from: "pictures",
          localField: "_id",
          foreignField: "project",
          as: "list",
        },
      },

      {
        $set: {
          created_By: { $arrayElemAt: ["$created_By.name", 0] },
        },
      },
      {
        $project: {
          // created_By:0,
          is_Deleted: 0,
          updatedAt: 0,
          is_Active: 0,
          description: 0,
          // _id:0,
          __v: 0,
        },
      },
    ]);
    if (data.length > 0) {
      return helperFunction.success(res, "User Projects", { projects: data });
    } else return helperFunction.custom(res, 404, "No Project Found", false);
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};
const get_UserProject2 = async (req, res) => {
  try {
    const data = await Projects.aggregate([
      {
        $match: {
          is_Deleted: false,
          created_By: ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "pictures",
          let: {
            projectid: "$_id",
          },
          pipeline: [
            {
              $match: {
                is_Deleted: false,
                $expr: {
                  $eq: ["$project", "$$projectid"],
                },
              },
            },

            {
              $lookup: {
                from: "tags",
                let: {
                  tagsids: "$tags",
                },
                pipeline: [
                  {
                    $match: {
                      is_Deleted: false,
                      $expr: {
                        $in: ["$_id", "$$tagsids"],
                      },
                    },
                  },
                ],
                as: "tags",
              },
            },
          ],
          as: "data",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "created_By",
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
          // created_By:0,
          is_Deleted: 0,
          updatedAt: 0,
          is_Active: 0,
          // _id:0,
          __v: 0,
        },
      },
    ]);
    let list = [];

    let projectList = [];

    data.forEach((element) => {
      var result = element.data.reduce(function (r, a) {
        r[moment(a.createdAt).format("YYYY-MM-DD")] =
          r[moment(a.createdAt).format("YYYY-MM-DD")] || [];
        r[moment(a.createdAt).format("YYYY-MM-DD")].push(a);
        return r;
      }, Object.create(null));
      var folderName = element.name;
      list.push({_id:element._id, folderName, data: result });
    });

    list.forEach((element) => {
      let finalList = [];
      Object.keys(element.data).forEach((data) => {
        var objData = { date: data, data: element.data[data] };
        finalList.push(objData);
      });
      projectList.push({_id:element._id, folderName: element.folderName, data: finalList });
    });

    return helperFunction.success(res, "User Projects", { list: projectList });
  } catch (error) {
    console.log(error);
  }
};

const delete_Project = async (req, res) => {
  try {
    const { _id } = req.query;
    let query;
    if (req.user.role !== "admin") {
      query = {
        is_Deleted: false,
        _id: ObjectId(_id),
        created_By: ObjectId(req.user._id),
      };
    } else {
      query = {
        _id: ObjectId(_id),
        is_Deleted: false,
      };
    }
    const data = await Projects.updateOne(
      query,
      {
        $set: { is_Deleted: true },
        $currentDate: { updatedAt: true },
      }
    );
    if (data.matchedCount !== 0) {
      return helperFunction.success(res, "Project Deleted");
    } else return helperFunction.custom(res, 404, "Project Not Found", false);
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};
const filterProject = async (req, res) => {
  try {
    const { search, to, from, status, created_By } = req.query;
    let query;
    if (search && to && from) {
      if (created_By) {
        if (status === "deleted") {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
            $and: [
              { createdAt: { $gte: ISODate(from) } },
              { createdAt: { $lte: ISODate(to) } },
            ],
            created_By,
            is_Deleted: true,
          };
        } else if (status === "is_Active") {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
            $and: [
              { createdAt: { $gte: ISODate(from) } },
              { createdAt: { $lte: ISODate(to) } },
            ],
            created_By,
            is_Deleted: false,
          };
        } else {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
            $and: [
              { createdAt: { $gte: ISODate(from) } },
              { createdAt: { $lte: ISODate(to) } },
            ],
            created_By,
          };
        }
      } else {
        query = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
          $and: [
            { createdAt: { $gte: ISODate(from) } },
            { createdAt: { $lte: ISODate(to) } },
          ],
        };
      }
    } else if (to && from) {
      if (created_By) {
        if (status === "deleted") {
          query = {
            $and: [
              { createdAt: { $gte: ISODate(from) } },
              { createdAt: { $lte: ISODate(to) } },
            ],
            created_By,
            is_Deleted: true,
          };
        } else if (status === "is_Active") {
          query = {
            $and: [
              { createdAt: { $gte: ISODate(from) } },
              { createdAt: { $lte: ISODate(to) } },
            ],
            created_By,
            is_Deleted: false,
          };
        } else {
          query = {
            $and: [
              { createdAt: { $gte: ISODate(from) } },
              { createdAt: { $lte: ISODate(to) } },
            ],
            created_By,
          };
        }
      } else {
        query = {
          $and: [
            { createdAt: { $gte: ISODate(from) } },
            { createdAt: { $lte: ISODate(to) } },
          ],
        };
      }
    } else if (search) {
      if (created_By) {
        if (status === "deleted") {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
            created_By,
            is_Deleted: true,
          };
        } else if (status === "is_Active") {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
            created_By,
            is_Deleted: false,
          };
        } else {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
            created_By,
          };
        }
      } else if (status) {
        if (status === "deleted") {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
            is_Deleted: true,
          };
        } else if (status === "is_Active") {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
            is_Deleted: false,
          };
        } else {
          query = {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          };
        }
      } else {
        query = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        };
      }
    } else if (status) {
      if (created_By) {
        if (status === "deleted") {
          query = {
            is_Deleted: true,
            created_By: ObjectId(created_By),
          };
        } else if (status === "is_Active") {
          query = {
            is_Deleted: false,
            created_By: ObjectId(created_By),
          };
        } else {
          query = {
            created_By: ObjectId(created_By),
          };
        }
      } else {
        if (status === "deleted") {
          query = {
            is_Deleted: true,
          };
        } else if (status === "is_Active") {
          query = {
            is_Deleted: false,
          };
        } else {
          query = {};
        }
      }
    } else {
      const data = await Projects.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "created_By",
            foreignField: "_id",
            as: "created_By",
          },
        },
        {
          $lookup: {
            from: "pictures",
            localField: "_id",
            foreignField: "project",
            pipeline: [ 
              { $match:
                {
                  "type": "picture",
                }
             },
             ],
            as: "pictures_count",
          },
        },
        { $addFields: { pictures_count: { $size: "$pictures_count" } } },
        {
          $lookup: {
            from: "pictures",
            localField: "_id",
            foreignField: "project",
            pipeline: [ 
              { $match:
                {
                  "type": "document",
                }
             },
             ],
            as: "documents_count",
          },
        },
        { $addFields: { documents_count: { $size: "$documents_count" } } },
        {
          $set: {
            created_By: { $arrayElemAt: ["$created_By.name", 0] },
          },
        },
      ]);
      return helperFunction.success(res, "Projects", { projects: data });
    }
    const data = await Projects.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "created_By",
          foreignField: "_id",
          as: "created_By",
        },
      },
      {
        $lookup: {
          from: "pictures",
          localField: "_id",
          foreignField: "project",
          pipeline: [ 
            { $match:
              {
                "type": "picture",
              }
           },
           ],
          as: "pictures_count",
        },
      },
      { $addFields: { pictures_count: { $size: "$pictures_count" } } },
      {
        $lookup: {
          from: "pictures",
          localField: "_id",
          foreignField: "project",
          pipeline: [ 
            { $match:
              {
                "type": "document",
              }
           },
           ],
          as: "documents_count",
        },
      },
      { $addFields: { documents_count: { $size: "$documents_count" } } },
      {
        $set: {
          created_By: { $arrayElemAt: ["$created_By.name", 0] },
        },
      },
    ]);
    return helperFunction.success(res, "Projects", { projects: data });
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};

module.exports = {
  addProject,
  get_AllProjects,
  get_Project,
  get_UserProject,
  get_UserProject2,
  update_Project,
  delete_Project,
  filterProject,
};
