const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
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

exports.changeUsername = [
  body("username")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("must be between 5-20 characters")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    } else {
      escapedUsername = he.decode(req.body.username);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { username: escapedUsername },
        { new: true }
      );

      res.send({ user });
    }
  }),
];

exports.changePassword = [
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("must be at least 5 characters")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    } else {
      escapedPassword = he.decode(req.body.password);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { password: escapedPassword },
        { new: true }
      );

      res.send({ user });
    }
  }),
];

exports.getFollowers = asyncHandler(async (req, res, next) => {
  const followersList = await User.findById(req.user.id).populate("followers");
  console.log("check followersList");
  console.log(followersList);

  res.send({});
});
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
