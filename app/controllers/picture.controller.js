const { ObjectId } = require("mongodb");
const logger = require("../logger");
const { Pictures } = require("../models/pictures");
const { Projects } = require("../models/projects");
const helperFunction = require("../utils/helperFunction");

const getPictureByProject = async (req, res) => {
  try {
    const { _id } = req.query;
    let query;
    if (req.user.role !== "admin") {
      query = {
        is_Deleted: false,
        project: _id,
        user: req.user._id,
        type: "picture",
      };
    } else {
      query = { project: _id, type: "picture" };
    }
    let data = await Pictures.find(query)
      .populate("user", "name")
      .populate("tags", "tag");
    return helperFunction.success(res, "Pictures", { pictures: data });
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};
const getDocumentByProject = async (req, res) => {
  try {
    const { _id } = req.query;
    let query;
    if (req.user.role !== "admin") {
      query = {
        is_Deleted: false,
        project: _id,
        user: req.user._id,
        type: "document",
      };
    } else {
      query = { project: _id, type: "document" };
    }
    let data = await Pictures.find(query)
      .populate("user", "name")
      .populate("tags", "tag");
    return helperFunction.success(res, "Documents", { pictures: data });
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};

const addPicture = async (req, res) => {
  try {
    const { project, tags, device, device_path, description, type } = req.body;
    const user = ObjectId(req.user._id);
    var imagePath = req.imagePath;
    let ip = req.ip.replace("::ffff:", "");
    let data = await Pictures({
      name: req.file.filename,
      image: imagePath,
      user,
      project,
      tags,
      device_path,
      device,
      description,
      type,
      ip_Address: ip,
    }).save();

    return helperFunction.success(res, "Picture Added Successfully", {
      picture: data,
    });
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};
const getPictureById = async (req, res) => {
  try {
    const user = ObjectId(req.user._id);
    let data = await Pictures.find({ user }).populate("project");
    return helperFunction.success(res, "Files", { pictures: data });
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};
const update_Picture = async (req, res) => {
  try {
    const { _id } = req.query;
    const user = ObjectId(req.user._id);
    const { name, description, tags } = req.body;
    var imagePath = req.imagePath;
    console.log(imagePath)
    const data = await Pictures.findOneAndUpdate(
      { _id, user, is_Deleted: false },
      {
        $set: { name,description,tags,image:imagePath, },
        $currentDate: { updatedAt: true },
      },
      {
        returnDocument: "after",
      }
    );
    if (data) {
      return helperFunction.success(res, "File Updated");
    } else return helperFunction.custom(res, 404, "File Not Found", false);
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};
const delete_Picture = async (req, res) => {
  try {
    const { _id } = req.query;
    const user = ObjectId(req.user._id);
    let query;
    if (req.user.role !== "admin") {
      query = {
        is_Deleted: false,
        _id: {
            $in: _id,
          },
        user: ObjectId(req.user._id),
      };
    } else {
      query = {
        _id: {
            $in: _id,
          },
        is_Deleted: false,
      };
    }
    const data = await Pictures.updateMany(
        query,
      {
        $set: { is_Deleted: true },
        $currentDate: { updatedAt: true },
      },
      { multi: true }
    );
    if (data.matchedCount > 0) {
      return helperFunction.success(res, "File Deleted");
    } else return helperFunction.custom(res, 404, "File Not Found", false);
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return helperFunction.serverError(res, "Some Error Is Occurred");
  }
};

module.exports = {
  addPicture,
  delete_Picture,
  getPictureById,
  getPictureByProject,
  getDocumentByProject,
  update_Picture,
};
