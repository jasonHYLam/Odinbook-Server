const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const users = require("../testData/users");
const posts = require("../testData/posts");
const comments = require("../testData/comments");

async function createUserDoc(user) {
  const newUser = new User(user);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  newUser.password = hashedPassword;
  await newUser.save();
}

async function createAllUserDocs() {
  users.map(async (user) => await createUserDoc(user));
}

const allPosts = posts.map((post) => new Post(post));
// const allComments = comments.map((comment) => new Comment(comment));

async function populateTestDB() {
  await Promise.all([
    createAllUserDocs(),
    Post.insertMany(allPosts),
    // Comment.insertMany(allComments),
  ]);
}

module.exports = populateTestDB;
