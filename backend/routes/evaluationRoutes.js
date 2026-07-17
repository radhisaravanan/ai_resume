const express = require("express");
const router = express.Router();
const {
  getNextQuestion,
  evaluateFinalGrade,
} = require("../controllers/evaluationController");

/**
 * Authentication Middleware Bridge Placeholder
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
    }
    next();
  } catch (err) {
    console.warn(
      "Auth token context parsing warning, proceeding via fallbacks.",
    );
    next();
  }
};

router.post("/next-question", authMiddleware, getNextQuestion);
router.post("/final-grade", authMiddleware, evaluateFinalGrade);

module.exports = router;
