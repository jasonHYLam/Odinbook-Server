const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getPost = asyncHandler(async (req, res, next) => {
  const { postID } = req.params;

  const post = await Post.findById(postID).exec();
  // .populate("creator", "username profilePicURL")
  // .populate("likedBy", "username profilePicURL");
  const comments = await Comment.find({ post: postID }).populate(
    "author",
    "username profilePicURL"
  );

  res.status(201).send({ post, comments });
});

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  const { following } = await User.findById(req.user.id).exec();

  const allPosts = await Post.find({ creator: { $in: following } })
    .populate("creator")
    .sort({ datePosted: -1 })
    .exec();
  console.log("checking allPosts");
  console.log(allPosts);
  res.status(201).send({ allPosts });
});

// delete post
// create post
// edit post
