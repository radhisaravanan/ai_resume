const express = require("express");
const router = express.Router();

const db = require("../config/db");

console.log("🔥 Evaluation Route Loaded");
console.log("✅ USING NEW EVALUATION ROUTE FILE");

// =====================================
// AI Answer Evaluation API
// POST /api/evaluation/check
// =====================================

router.post("/check", (req, res) => {
  const { answer_id } = req.body;

  if (!answer_id) {
    return res.status(400).json({
      success: false,

      message: "answer_id required",
    });
  }

  // Get candidate answer

  const getAnswer = `

        SELECT answer

        FROM interview_answers

        WHERE id = ?

    `;

  db.query(
    getAnswer,
    [answer_id],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,

          message: "Database error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,

          message: "Answer not found",
        });
      }

      const answerText = result[0].answer;

      // ==========================
      // Simple AI Evaluation Logic
      // ==========================

      let technical_score = 0;
      let relevance_score = 0;
      let communication_score = 0;

      // Technical keyword checking

      const keywords = ["react", "hook", "state", "component", "javascript"];

      let matched = 0;

      keywords.forEach((word) => {
        if (answerText.toLowerCase().includes(word)) {
          matched++;
        }
      });

      technical_score = matched * 20;

      if (technical_score > 100) {
        technical_score = 100;
      }

      // Relevance score

      if (answerText.length > 30) {
        relevance_score = 85;
      } else {
        relevance_score = 50;
      }

      // Communication score

      if (answerText.split(" ").length > 5) {
        communication_score = 80;
      } else {
        communication_score = 50;
      }

      const total_score = Math.round(
        (technical_score + relevance_score + communication_score) / 3,
      );

      let feedback = "";

      if (total_score >= 80) {
        feedback = "Excellent answer. Good technical explanation.";
      } else if (total_score >= 60) {
        feedback = "Good answer but needs more details.";
      } else {
        feedback = "Answer needs improvement.";
      }

      // Save evaluation

      const insertSQL = `

            INSERT INTO answer_evaluations

            (
             answer_id,
             technical_score,
             relevance_score,
             communication_score,
             total_score,
             feedback
            )

            VALUES (?,?,?,?,?,?)

            `;

      db.query(
        insertSQL,

        [
          answer_id,
          technical_score,
          relevance_score,
          communication_score,
          total_score,
          feedback,
        ],

        (err) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              success: false,

              message: "Evaluation save failed",
            });
          }

          res.json({
            success: true,

            evaluation: {
              technical_score,

              relevance_score,

              communication_score,

              total_score,

              feedback,
            },
          });
        },
      );
    },
  );
});

module.exports = router;
