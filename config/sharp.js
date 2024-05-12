const sharp = require("sharp");

function createThumbnail(input) {
  console.log(input);
  sharp(input)
    .resize(300, 300, { fit: "cover" })
    .toFormat("webp")
    .toFile("output.webp");
}
module.exports = { createThumbnail };
