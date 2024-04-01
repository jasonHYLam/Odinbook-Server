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
  const { followers } = await User.findById(req.user.id)
    .populate("followers", "username profilePicURL")
    .exec();
  console.log("check followersList");
  console.log(followers);

  res.status(201).send({ followers });
});

exports.getFollowing = asyncHandler(async (req, res, next) => {
  const { following } = await User.findById(req.user.id)
    .populate("following", "username profilePicURL")
    .exec();
  console.log("check followingList");
  console.log(following);

  res.status(201).send({ following });
});
// view feed
// view particular post
// view followers list
// view folllowing list
// follow account
exports.followUser = asyncHandler(async (req, res, next) => {
  const { userID } = req.params;
  // update own following list
  const loggedInUser = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { following: userID } },
    { new: true }
  );
  // update follower's followers list
  const userFollowing = await User.findByIdAndUpdate(
    userID,
    { $push: { followers: req.user.id } },
    { new: true }
  );

  res.status(201).send({ loggedInUser, userFollowing });
});

exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const { userID } = req.params;

  const loggedInUser = await User.findByIdAndUpdate(
    req.user.id,
    // try and remove... maybe this is a sort. or maybe there's another mongoDB method
    { $pull: { following: userID } },
    { new: true }
  );

  const userFollowing = await User.findByIdAndUpdate(
    userID,
    { $pull: { followers: req.user.id } },
    { new: true }
  );

  res.status(201).send({ loggedInUser, userFollowing });
});

// remove following
// change username, password, profilePic
//
// exports.
