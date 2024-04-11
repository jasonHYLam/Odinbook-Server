const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { upload } = require("../config/multer");
const bcrypt = require("bcryptjs");
const he = require("he");
const User = require("../models/User");
const Post = require("../models/Post");

// view profile
exports.getLoggedInUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id, "-password")
    .populate("following", "-password -following -followers")
    .populate("followers", "-password -following -followers")
    .exec();
  res.status(201).send({ user });
});
exports.view_personal_profile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate("following", "-password")
    .populate("followers", "-password")
    .exec();
  const posts = await Post.find({ creator: req.user.id })
    .populate("creator", "-password")
    .exec();
  const isLoggedInUser = true;
  res.json({ user, posts, isLoggedInUser });
});

exports.view_profile = asyncHandler(async (req, res, next) => {
  const { userID } = req.params;
  const user = await User.findById(userID, "-password").exec();
  const posts = await Post.find({ creator: userID });
  const isLoggedInUserFollowing = user.followers.some(
    (follower) => follower.toString() === req.user.id
  );
  const isLoggedInUser = false;

  res.json({ user, posts, isLoggedInUser, isLoggedInUserFollowing });
});

exports.changeUsername = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage("must be between 3-25 characters")
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
        { new: true, select: "-password" }
      );

      res.send({ user });
    }
  }),
];

exports.changePassword = [
  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    } else {
      escapedPassword = he.decode(req.body.password);

      try {
        const hashedPassword = await bcrypt.hash(escapedPassword, 10);
        const user = await User.findByIdAndUpdate(
          req.user.id,
          { password: hashedPassword },
          { new: true }
        );

        res.send({ user });
      } catch (err) {
        if (err) next(err);
      }
    }
  }),
];

exports.changeProfilePic = [
  upload.single("profilePic"),
  asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicURL: req.file.path },
      { new: true, select: "-password" }
    );

    res.status(201).send({ user });
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
  // console.log("check followingList");
  // console.log(following);

  res.status(201).send({ following });
});
// view feed
// view particular post
// view followers list
// view folllowing list
// follow account
exports.followUser = asyncHandler(async (req, res, next) => {
  const { userID } = req.params;

  // check that user is not already followed. If so, send error.
  const { following } = await User.findById(req.user.id);
  if (following.includes(userID)) {
    return res.status(400).end();
  }
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

  const { following } = await User.findById(req.user.id);
  if (!following.includes(userID)) {
    return res.status(400).end();
  }

  const loggedInUser = await User.findByIdAndUpdate(
    req.user.id,
    // try and remove... maybe this is a sort. or maybe there's another mongoDB method
    { $pull: { following: userID } },
    { new: true }
  );

  const userUnfollowed = await User.findByIdAndUpdate(
    userID,
    { $pull: { followers: req.user.id } },
    { new: true }
  );

  res.status(201).send({ loggedInUser, userUnfollowed });
});

exports.searchUsers = [
  body("searchQuery").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).end();
    } else {
      // need to use regex here
      const searchQuery = he.decode(req.body.searchQuery);
      const users = await User.find({
        _id: { $ne: req.user._id },
        username: { $regex: searchQuery, $options: "i" },
      });
      res.status(201).send({ users });
    }
  }),
];
