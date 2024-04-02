const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

router.get("/all_posts", postController.getAllPosts);
router.get("/:postID", postController.getPost);

module.exports = router;
