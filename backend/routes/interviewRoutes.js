const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  startInterview,
  getQuestion,
  submitAnswer,
} = require("../controllers/interviewController");

router.post("/start", verifyToken, startInterview);

router.get("/question/:sessionId", verifyToken, getQuestion);

router.post("/answer", verifyToken, submitAnswer);

module.exports = router;
