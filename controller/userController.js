const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// view profile
exports.view_personal_profile = asyncHandler(async (req, res, next) => {
  console.log("checking the call of the night");
  const matchingUser = await User.findById(req.user.id);
  console.log("checking matchingUser");
  console.log(matchingUser);
  // mm how do i get their posts?
  const matchingUserPosts = await Post.find({ creator: req.user.id });
  console.log("checking matchingUser");
  console.log(matchingUserPosts);

  res.json(matchingUser, matchingUserPosts);
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
