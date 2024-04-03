const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

router.get("/all_posts", postController.getAllPosts);
router.post("/create_post", postController.createPost);
router.put("/:postID/edit", postController.editPost);

router.get("/:postID", postController.getPost);

module.exports = router;
