const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { upload } = require("../config/multer");
const { isValidObjectId } = require("mongoose");

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
  res.status(201).send({ allPosts });
});

exports.createPost = [
  body("text").trim().isLength({ min: 1, max: 500 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    const escapedText = he.decode(req.body.text);

    const newPost = new Post({
      text: escapedText,
      creator: req.user._id,
      datePosted: new Date(),
    });
    await newPost.save();

    res.status(201).send({ newPost });
  }),
];

exports.createPostWithImage = [
  upload.single("image"),
  body("text").trim().isLength({ min: 1, max: 500 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).end();
    next();
  }),

  // upload.array("image", 4),

  asyncHandler(async (req, res, next) => {
    const escapedText = he.decode(req.body.text);
    const imagePathURLs = req.file.map((file) => file.path);

    const newPost = new Post({
      text: escapedText,
      creator: req.user._id,
      imageURLs: imagePathURLs,
      datePosted: new Date(),
    });

    newPost.save();
    res.status(201).send({ newPost });
  }),
];

// edit post
exports.editPost = [
  body("text").trim().isLength({ min: 0, max: 500 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    const { postID } = req.params;
    if (!isValidObjectId(postID)) return res.status(400).end();

    const matchingPost = await Post.findById(postID).exec();
    if (!matchingPost) return res.status(400).end();

    const escapedText = he.decode(req.body.text);
    const editedPost = await Post.findByIdAndUpdate(
      postID,
      { text: escapedText },
      { new: true }
    );
    res.status(201).send({ editedPost });
  }),
];

// delete post, lets come back to this after deleting comments

exports.likePost = asyncHandler(async (req, res, next) => {
  const { postID } = req.params;

  const likedPost = await Post.findByIdAndUpdate(
    postID,
    { $push: { likedBy: req.user.id } },
    { new: true }
  );

  res.status(201).send({ likedPost });
});
