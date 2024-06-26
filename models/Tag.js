const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opts = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  versionKey: false,
};

const TagSchema = new Schema(
  {
    name: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  opts
);

module.exports = mongoose.model("Tag", TagSchema);
