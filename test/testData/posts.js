const { userIDs, postIDs } = require("./ids");

const posts = [
  {
    _id: postIDs[0],
    text: "1st post woo",
    creator: userIDs[0],
    datePosted: new Date("2024-03-21T11:30:00"),
    likedBy: [userIDs[1], userIDs[2], userIDs[3]],
  },
  {
    _id: postIDs[1],
    text: "2nd post yup yup",
    creator: userIDs[1],
    datePosted: new Date("2024-03-21T11:33:00"),
    likedBy: [userIDs[0], userIDs[2], userIDs[3]],
  },
  {
    _id: postIDs[2],
    text: "3rd post eep",
    creator: userIDs[2],
    datePosted: new Date("2024-03-21T11:36:00"),
    likedBy: [userIDs[1], userIDs[0], userIDs[3]],
  },
];

module.exports = posts;
