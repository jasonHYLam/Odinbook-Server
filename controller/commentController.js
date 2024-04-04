const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
const Comment = require("../models/Comment");

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
    const escapedText = he.decode(req.body.text);
    const newComment = new Comment({
      text: escapedText,
      author: req.user._id,
      post: postID,
      dateCommented: new Date(),
    });

    res.status(201).send({ newComment });
  }),
];
