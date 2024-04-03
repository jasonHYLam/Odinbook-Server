const multer = require("multer");
const { storage } = require("./cloudinary");

const upload = multer({ storage: storage });

module.exports = { upload };
