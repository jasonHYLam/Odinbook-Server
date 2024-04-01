const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

router.get("/get_post", postController.getPost);

module.exports = router;
