const { ObjectId } = require("mongoose").Types;

module.exports = {
  userIDs: [
    new ObjectId(`65be5813dad7a9ce85209436`),
    new ObjectId(`65be5818dad7a9ce85209438`),
    new ObjectId(`65be581edad7a9ce8520943a`),
    new ObjectId(`65bead9ffc37f417a9ca2770`),
    new ObjectId(`65bead9ffc37f417a9ca2771`),
  ],

  postIDs: [
    new ObjectId(`65c00221c4dffec208392077`),
    new ObjectId(`65c65c2323b8d051d7302f8d`),
    new ObjectId(`65c65c3423b8d051d7302fa7`),
  ],

  commentIDs: [
    new ObjectId(`65c0f5dcf0e1ac63c1209398`),
    new ObjectId(`65c11539f0e1ac63c12093a5`),
    new ObjectId(`65c1165baa050fa15b0bf575`),
    new ObjectId(`65c1165baa050fa15b0bf576`),
  ],
};
