const mongoose = require("mongoose");

const opts = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  versionKey: false,
};

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    text: { type: String, required: true, maxLength: 1000 },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    imageURLs: [{ type: String }],
    datePosted: { type: Date, required: true },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean },
  },
  opts
);

PostSchema.virtual("likesCount").get(function () {
  return this.likedBy.length;
});

module.exports = mongoose.model("Post", PostSchema);
