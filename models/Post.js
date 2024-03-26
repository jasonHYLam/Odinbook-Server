const mongoose = require("mongoose");

const opts = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    text: { type: String, required: true, maxLength: 1000 },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    imageURLs: [{ type: String }],
    datePosted: { type: Date, required: true },
  },
  opts
);

module.exports = mongoose.model("Post", PostSchema);
