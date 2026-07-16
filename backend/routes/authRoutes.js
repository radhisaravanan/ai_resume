const express = require("express");
const router = express.Router();

// Import the synced authentication controller
const authController = require("../controllers/authController");

// Ensure clean routing callbacks without argument handler function mismatches
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
