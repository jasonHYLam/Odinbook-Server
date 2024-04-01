const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

router.get("/:postID", postController.getPost);

module.exports = router;
