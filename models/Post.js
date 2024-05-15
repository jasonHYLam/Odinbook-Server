const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const opts = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  versionKey: false,
};

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, maxLength: 50 },
    description: { type: String, maxLength: 1000 },
    // text: { type: String, required: true, maxLength: 1000 },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    imageURL: { type: String },
    thumbnailImageURL: { type: String },
    datePosted: { type: Date, required: true },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean },
  },
  opts
);

PostSchema.virtual("likesCount").get(function () {
  if (this.likedBy) return this.likedBy.length;
});

PostSchema.virtual("bookmarksCount").get(function () {
  if (this.bookmarkedBy) return this.bookmarkedBy.length;
});

PostSchema.virtual("datePostedFormatted").get(function () {
  return DateTime.fromJSDate(this.datePosted).toFormat("T dd/LL/yy");
});

module.exports = mongoose.model("Post", PostSchema);
