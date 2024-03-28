const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const users = require("../testData/users");

async function createUserDoc(user) {
  const newUser = new User(user);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  newUser.password = hashedPassword;
}

const allTestUsers = users.map(async (user) => await createUserDoc(user));

async function populateTestDB() {
  await Promise.all([User.insertMany(allTestUsers)]);
}

module.exports = populateTestDB;
