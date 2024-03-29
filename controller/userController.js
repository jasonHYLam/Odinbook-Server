const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Post = require("../models/Post");

// view profile
exports.view_personal_profile = asyncHandler(async (req, res, next) => {
  console.log("checking the call of the night");
  const user = await User.findById(req.user.id).exec();
  console.log("checking matchingUser");
  console.log(user);
  // mm how do i get their posts?
  const posts = await Post.find({ creator: req.user.id }).exec();
  console.log("checking matchingUserPosts");
  console.log(posts);

  res.json({ user, posts });
});

exports.view_profile = asyncHandler(async (req, res, next) => {});
// view feed
// view particular post
// view followers list
// view folllowing list
// follow account
// remove follower
// remove following
// change username, password, profilePic
//
// exports.
