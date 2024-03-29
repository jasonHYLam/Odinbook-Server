const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/view_personal_profile", userController.view_personal_profile);
router.post("/change_username", userController.changeUsername);

module.exports = router;
