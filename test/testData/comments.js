const { userIDs, postIDs, commentIDs } = require("./ids");

const comments = [
  {
    _id: commentIDs[0],
    text: "woah this is really cool",
    author: userIDs[1],
    post: postIDs[0],
    dateCommented: new Date("2024-03-21T11:39:00"),
  },
  {
    _id: commentIDs[1],
    text: "I hate to agree...",
    author: userIDs[2],
    post: postIDs[0],
    dateCommented: new Date("2024-03-21T11:40:00"),
  },
  {
    _id: commentIDs[2],
    text: "Got a bad feeling about this...",
    author: userIDs[3],
    post: postIDs[0],
    dateCommented: new Date("2024-03-21T11:41:00"),
  },
  {
    _id: commentIDs[3],
    text: "Comment in post[1]",
    author: userIDs[3],
    post: postIDs[1],
    dateCommented: new Date("2024-03-21T11:41:00"),
  },
];

module.exports = comments;
