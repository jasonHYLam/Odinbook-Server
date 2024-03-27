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

function setUpUserDocs() {
  users.map(async (user) => await createUserDoc(user));
}

async function populateTestDB() {
  await Promise.all([setUpUserDocs]);
}

module.export = populateTestDB;
