const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const he = require("he");
const passport = require("passport");

const User = require("../models/User");

exports.signup = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage("must be between 3-25 characters")
    .escape(),

  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters")
    .escape(),

  body("confirmPassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("please reconfirm password")
    .custom((value, { req }) => value === req.body.password)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("checking errors");
      console.log(errors);
      return res.status(400).send({ errors: errors.array() });
    } else {
      escapedUsername = he.decode(req.body.username);
      escapedPassword = he.decode(req.body.password);

      const existingUser = await User.findOne({ username: escapedUsername });
      if (existingUser) {
        return res.status(400).send({ error: "Username already taken" });
      }

      console.log("escapedPassword");
      console.log(escapedPassword);

      bcrypt.hash(escapedPassword, 10, async (err, hashedPassword) => {
        try {
          console.log("hashedPassword");
          console.log(hashedPassword);
          const newUser = new User({
            username: escapedUsername,
            password: hashedPassword,
          });
          await newUser.save();
          res.send({});
        } catch (err) {
          res.send({ err });
        }
      });
    }
  }),
];

exports.login = [
  body("username").trim().escape(),

  // asyncHandler(async (req, res, next) => {
  //   passport.authenticate("local", function (err, user) {
  //     if (err) {
  //       res.send({ err });
  //     }
  //   });
  // }),
  passport.authenticate("local"),

  asyncHandler(async (req, res, next) => {
    res.end();
  }),
];

exports.logout = asyncHandler(async (req, res, next) => {
  // req.logout clears cookie and req.user.
  req.logout((err) => {
    if (err) return next(err);
    res.end();
  });
});

exports.isAuthenticated = (req, res, next) => {
  if (!req.user) return res.status(401).end();
  next();
};

exports.allowLoginOrSignup = (req, res, next) => {
  if (req.user) return res.status(401).end();
  next();
};
