const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getPost = asyncHandler(async (req, res, next) => {
  const { postID } = req.params;
  console.log("checking postID");
  console.log(postID);
  const posts = await Post.find().exec();
  console.log("checking posts");
  console.log(posts);

  const post = await Post.findById(postID).exec();
  // .populate("creator", "username profilePicURL")
  // .populate("likedBy", "username profilePicURL");
  const comments = await Comment.find({ post: postID }).populate(
    "author",
    "username profilePicURL"
  );

  console.log("checking post");
  console.log(post);

  res.status(201).send({ post, comments });
});

exports.view_all_posts = asyncHandler(async (req, res, next) => {});

// delete post
// create post
// edit post
