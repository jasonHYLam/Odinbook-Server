const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getPost = asyncHandler(async (req, res, next) => {
  const { postID } = req.params;
  const post = await Post.findById(postID)
    .populate("creator")
    .populate("likedBy");
  const comments = await Comment.find({ post: postID }).populate("author");

  res.status(201).send({ post, comments });
});

exports.view_all_posts = asyncHandler(async (req, res, next) => {});

// delete post
// create post
// edit post
