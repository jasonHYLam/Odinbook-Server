const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const users = require("../testData/users");

async function createUserDoc(user) {
  const newUser = new User(user);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  newUser.password = hashedPassword;
  await newUser.save();
}

async function createAllUserDocs() {
  users.map(async (user) => await createUserDoc(user));
}

async function populateTestDB() {
  await Promise.all([createAllUserDocs()]);
}

module.exports = populateTestDB;
