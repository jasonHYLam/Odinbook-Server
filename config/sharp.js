const sharp = require("sharp");

const createThumbnail = await sharp(input)
  .resize(300, 300, { fit: cover })
  .toFormat("webp")
  .toFile();
