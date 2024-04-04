const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentController");

router.post("/:postID/comment", commentController.writeComment);
router.put("/:postID/:commentID/edit", commentController.editComment);
router.delete("/:postID/:commentID/delete", commentController.deleteComment);

module.exports = router;
