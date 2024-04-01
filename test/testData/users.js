const { userIDs } = require("./ids");

const users = [
  {
    _id: userIDs[0],
    username: "User0",
    password: "Abc123",
    profilePicURL: "",
    followers: [userIDs[1]],
    following: [userIDs[(1, 2)]],
  },
  {
    _id: userIDs[1],
    username: "User1",
    password: "Abc123",
    profilePicURL: "",
    followers: [userIDs[0]],
    following: [userIDs[0]],
  },
  {
    _id: userIDs[2],
    username: "User2",
    password: "Abc123",
    profilePicURL: "",
    followers: [userIDs[0]],
    following: [userIDs[3]],
  },
  {
    _id: userIDs[3],
    username: "User3",
    password: "Abc123",
    profilePicURL: "",
    followers: [userIDs[2]],
  },
];

module.exports = users;
