const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interviewController");

router.post("/question", interviewController.generateQuestion);
router.post("/answer", interviewController.saveAnswerAndEvaluate);
router.get("/report/:regno", interviewController.getFinalReport);

module.exports = router;
