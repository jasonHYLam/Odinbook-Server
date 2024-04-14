const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const opts = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  versionKey: false,
};

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    text: { type: String, required: true, maxLength: 1000 },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    imageUrl: { type: String },
    dateCommented: { type: Date, required: true },
    isDeleted: { type: Boolean },
  },
  opts
);

CommentSchema.virtual("dateCommentedFormatted").get(function () {
  return DateTime.fromJSDate(this.dateCommented).toFormat("T dd/LL/yy");
});

module.exports = mongoose.model("Comment", CommentSchema);
