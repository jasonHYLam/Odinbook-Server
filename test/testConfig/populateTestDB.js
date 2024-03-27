const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const users = require("../testData/users");

async function createUserDoc(user) {
  const newUser = new User({
    username: user.username,
    password: user.password,
  });
  await newUser.save();
}

function setUpUsers() {
  users.map;
}
