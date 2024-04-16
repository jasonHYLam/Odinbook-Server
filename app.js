const express = require("express");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
const cors = require("cors");
const initializePassport = require("./config/passport");
const passport = require("passport");
require("dotenv").config();
require("./config/mongo");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");

const app = express();

initializePassport(passport);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    credentials: true,
    // origin: process.env.FRONTEND_DOMAIN,
    origin: true,
  })
);

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: process.env.MODE === "prod",
      secure: process.env.MODE === "prod",
      sameSite: process.env.MODE === "prod" ? "none" : "lax",
      partitioned: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

module.exports = app;
