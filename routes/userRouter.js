const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { isAuthenticated } = require("../controller/authController");

router.get("test", userController.testController);
router.get(
  "/get_logged_in_user",
  isAuthenticated,
  userController.getLoggedInUser
);
router.get(
  "/view_personal_profile",
  isAuthenticated,
  userController.view_personal_profile
);
router.get("/:userID/profile", isAuthenticated, userController.view_profile);
router.put("/change_username", userController.changeUsername);
router.put("/change_password", userController.changePassword);
router.put("/change_profile_pic", userController.changeProfilePic);
router.get("/get_followers", userController.getFollowers);
router.get("/get_following", userController.getFollowing);
router.post("/search_users", userController.searchUsers);
router.post("/:userID/follow", userController.followUser);
router.post("/:userID/unfollow", userController.unfollowUser);

module.exports = router;
