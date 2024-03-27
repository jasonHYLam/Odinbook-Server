const { userIds } = require("./ids");

const users = [
  {
    _id: userIds[0],
    username: "User0",
    password: "Abc123",
    followers: [userIds[1]],
  },
  {
    _id: userIds[1],
    username: "User1",
    password: "Abc123",
    following: [userIds[0]],
  },
  {
    _id: userIds[2],
    username: "User2",
    password: "Abc123",
    following: [userIds[3]],
  },
  {
    _id: userIds[3],
    username: "User3",
    password: "Abc123",
    followers: [userIds[2]],
  },
];

module.exports = users;
