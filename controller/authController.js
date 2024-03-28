const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const he = require("he");
const passport = require("passport");

const User = require("../models/User");

exports.signup = [
  body("username")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("must be between 5-20 characters")
    .escape(),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("must be at least 5 characters")
    .escape(),

  body("confirmPassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("please reconfirm password")
    .custom((value, { req }) => {
      if (value === req.body.password) throw new Error("passwords must match");
    })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    } else {
      escapedUsername = he.decode(req.body.username);
      escapedPassword = he.decode(req.body.username);
      try {
        const hashedPassword = await bcrypt.hash(escapedPassword, 10);
        const newUser = new User({
          username: escapedUsername,
          password: hashedPassword,
        });
        await newUser.save();
        res.end();
      } catch (err) {
        if (err) next(err);
      }
    }
  }),
];

exports.login = [
  body("username").trim().escape(),
  body("password").trim().escape(),

  passport.authenticate("local"),

  asyncHandler(async (req, res, next) => {
    // may need to pass in userID
    const { _id, username } = req.user;
    res.status(201).send({ username, _id });
  }),
];
