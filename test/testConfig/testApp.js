const express = require("express");
const session = require("express-session");
const initializePassport = require("../../config/passport");
const passport = require("passport");
require("dotenv").config();
// require("../../config/mongo");
const indexRouter = require("../../routes/index");

const app = express();
