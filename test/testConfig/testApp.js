const express = require("express");
const session = require("express-session");
const initializePassport = require("../../config/passport");
const passport = require("passport");
require("dotenv").config();
const indexRouter = require("../../routes/index");
const authRouter = require("../../routes/authRoutes");
const userRouter = require("../../routes/userRouter");

initializePassport(passport);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: process.env.MODE === "prod",
      secure: process.env.MODE === "prod",
      sameSite: process.env.MODE === "prod" ? "none" : "lax",
    },
  })
);

app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

module.exports = app;
