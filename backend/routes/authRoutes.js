const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Secure registration dynamic checkpoint router sequence
router.post("/register", authController.register);

// Secure login check execution pathway routing endpoint configuration
router.post("/login", authController.login);

module.exports = router;
