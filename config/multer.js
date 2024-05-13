const multer = require("multer");
const { cloudinaryStorage } = require("./cloudinary");

const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });
const uploadDirectlyToCloudinary = multer({ storage: cloudinaryStorage });

module.exports = { upload, uploadDirectlyToCloudinary };
