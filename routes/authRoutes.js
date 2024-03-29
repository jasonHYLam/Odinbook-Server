const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post(
  "/signup",
  authController.allowLoginOrSignup,
  authController.signup
);
router.post("/login", authController.allowLoginOrSignup, authController.login);
router.delete("/logout", authController.isAuthenticated, authController.logout);

module.exports = router;
