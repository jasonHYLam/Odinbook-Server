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

  console.log("checking following");
  console.log(following);

  const allPosts = await Post.find({ creator: { $in: following } })
    .sort({ datePosted: -1 })
    .exec();
  console.log("checking allPosts");
  console.log(allPosts);
  res.status(201).send({});
});

// delete post
// create post
// edit post
