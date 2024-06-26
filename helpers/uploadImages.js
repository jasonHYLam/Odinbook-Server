require("dotenv").config();
const sharp = require("sharp");
const DatauriParser = require("datauri/parser");
const { upload, uploadDirectlyToCloudinary } = require("../config/multer");
const asyncHandler = require("express-async-handler");
const { cloudinary } = require("../config/cloudinary");
const { uploader } = cloudinary;

const uploadFilesToCloudinary = [
  upload.single("images"),

  asyncHandler(async (req, res, next) => {
    const { originalname } = req.file;
    const thumbnailName = `thumbnail-${originalname}`;

    const originalBuffer = req.file.buffer;
    const duplicateBuffer = req.file.buffer;

    const parser = new DatauriParser();
    const { content } = parser.format(".webp", originalBuffer);

    const uploadOriginalResponse = await uploader.upload(content, {
      folder: `odinbook/${process.env.MODE}`,
    });
    req.imageURL = uploadOriginalResponse.secure_url;

    await sharp(duplicateBuffer)
      .resize(300, 300, { fit: "cover" })
      .toFormat("webp")
      .toFile(thumbnailName);
    const uploadDuplicateResponse = await uploader.upload(thumbnailName, {
      folder: `odinbook/${process.env.MODE}/thumbnail`,
    });
    req.thumbnailURL = uploadDuplicateResponse.secure_url;

    next();
  }),
];

module.exports = { uploadFilesToCloudinary };
