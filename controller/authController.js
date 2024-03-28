const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const he = require("he");

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
