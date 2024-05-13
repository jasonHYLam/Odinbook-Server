require("dotenv").config();
const sharp = require("sharp");
const { upload, uploadDirectlyToCloudinary } = require("../config/multer");
const asyncHandler = require("express-async-handler");
const { cloudinary } = require("../config/cloudinary");

const { uploader } = cloudinary;

const uploadFiles = (req, res, next) => {
  uploadDirectlyToCloudinary.single("images")(req, res, next);
  upload.single("images")(req, res, next);
  console.log("checking req file");
  console.log(req.file);
};

const createThumbnail = [
  async (req, res, next) => {
    upload.single("images")(req, res, next);
    upload.single("images")(req, res, next);
    // next();
  },

  // uploadFiles,

  // upload.single("images"),
  // upload.single("images"),
  asyncHandler(async (req, res, next) => {
    console.log("checking req.file");
    console.log(req.file);
    const { originalname } = req.file;

    const thumbnailName = `thumbnail-${originalname}`;

    console.log("checking original name");
    console.log(originalname);

    await sharp(req.file.buffer)
      .resize(300, 300, { fit: "cover" })
      .toFormat("webp")
      .toFile(thumbnailName);

    const response = await uploader.upload(thumbnailName, {
      folder: `odinbook/${process.env.MODE}/thumbnail`,
    });
    console.log("checking response");
    console.log(response);
    req.thumbnailURL = response.secure_url;
    next();
    // res.end();
  }),
];
module.exports = { createThumbnail };
