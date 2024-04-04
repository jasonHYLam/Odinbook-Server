const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

router.get("/all_posts", postController.getAllPosts);
router.post("/create_post", postController.createPost);
router.post("/create_post_with_image", postController.createPostWithImage);
router.put("/:postID/edit", postController.editPost);
router.put("/:postID/like", postController.likePost);
router.put("/:postID/unlike", postController.unlikePost);
router.delete("/:postID/delete", postController.deletePost);

router.get("/:postID", postController.getPost);

module.exports = router;
