const multer = require("multer");
const { storage } = require("./cloudinary");

const upload = multer({ storage: storage });
const uploadOriginal = multer({ storage: storage });

module.exports = { upload, uploadOriginal };
