const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const { isAuthenticated } = require("../controller/authController");

router.get("/all_posts", isAuthenticated, postController.getFeed);
router.get("/liked_posts", isAuthenticated, postController.getLikedPosts);
router.get(
  "/bookmarked_posts",
  isAuthenticated,
  postController.getBookmarkedPosts
);
router.get("/all_tags", isAuthenticated, postController.getAllTags);

router.post("/tag_test", postController.tagTest);

router.post("/create_post_with_image", postController.createPostWithImage);
router.put("/:postID/edit", postController.editPost);
router.put("/:postID/like", postController.likePost);
router.put("/:postID/unlike", postController.unlikePost);
router.put("/:postID/toggle_bookmark", postController.toggleBookmarkPost);
router.delete("/:postID/delete", postController.deletePost);

router.get("/:postID", isAuthenticated, postController.getPost);

module.exports = router;
