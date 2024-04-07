const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { isValidObjectId } = require("mongoose");

exports.writeComment = [
  body("text")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("must be between 1-100 characters")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send({ errors });

    const { postID } = req.params;
    if (!isValidObjectId(postID)) return res.status(400).send({ errors });
    const matchingPost = await Post.findById(postID).exec();
    if (!matchingPost) return res.status(400).end();

    const escapedText = he.decode(req.body.text);
    const newComment = new Comment({
      text: escapedText,
      author: req.user._id,
      post: postID,
      dateCommented: new Date(),
    });
    await newComment.save();

    res.status(201).send({ newComment });
  }),
];

exports.editComment = [
  body("text")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("must be between 1-100 characters")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send({ errors });

    const { postID, commentID } = req.params;
    if (!isValidObjectId(postID) || !isValidObjectId(commentID)) {
      return res.status(400).end();
    }

    const matchingPost = await Post.findById(postID).exec();
    const matchingComment = await Comment.findById(commentID).exec();
    const isCommentInPost = await Comment.findOne({
      _id: commentID,
      post: postID,
    }).exec();
    if (!matchingPost || !matchingComment || !isCommentInPost) {
      return res.status(400).end();
    }

    const escapedText = he.decode(req.body.text);

    const editedComment = await Comment.findByIdAndUpdate(
      commentID,
      { text: escapedText },
      { new: true }
    );

    res.status(201).send({ editedComment });
  }),
];

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const { postID, commentID } = req.params;

  if (!isValidObjectId(postID) || !isValidObjectId(commentID)) {
    return res.status(400).end();
  }

  const matchingPost = await Post.findById(postID).exec();
  const matchingComment = await Comment.findById(commentID).exec();
  const isCommentInPost = await Comment.findOne({
    _id: commentID,
    post: postID,
  }).exec();
  if (!matchingPost || !matchingComment || !isCommentInPost) {
    return res.status(400).end();
  }

  const deletedComment = await Comment.findByIdAndUpdate(
    commentID,
    { text: "This comment has been deleted", isDeleted: true },
    { new: true }
  );

  res.status(200).send({ deletedComment });
});
