const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const he = require("he");
const User = require("../models/User");
const Post = require("../models/Post");

exports.view_post = asyncHandler(async (req, res, next) => {});

exports.view_all_posts = asyncHandler(async (req, res, next) => {});

// delete post
// create post
// edit post
