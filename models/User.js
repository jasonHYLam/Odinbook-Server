const mongoose = require("mongoose");

const opts = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, maxLength: 30 },
    password: { type: String, required: true, minLength: 3 },
    profilePicURL: { type: String },
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  opts
);

module.exports = mongoose.model("User", UserSchema);
