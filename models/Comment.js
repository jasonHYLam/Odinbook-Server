const mongoose = require("mongoose");

const opts = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    text: { type: String, required: true, maxLength: 1000 },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    imageUrl: { type: String },
    dateCommented: { type: Date, required: true },
  },
  opts
);

module.exports = mongoose.model("Comment", CommentSchema);
