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
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

initializePassport(passport);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", 1);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_DOMAIN,
  })
);

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

app.use(passport.initialize());
app.use(passport.session());

// app.use("/", indexRouter);
app.use("/auth", authRouter);
// app.use("/users", usersRouter);

module.exports = app;
