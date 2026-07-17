const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interviewController");

// STAGE 1: Motivation + first question (called only for Q1)
router.post("/motivation", interviewController.generateMotivation);

// STAGE 2: Question generation (Q2-Q5)
router.post("/question", interviewController.generateQuestion);

// STAGE 3: Save answer + return [SUGGESTION] feedback
router.post("/answer", interviewController.saveAnswerAndEvaluate);

// Final report
router.get("/report/:regno", interviewController.getFinalReport);

module.exports = router;
