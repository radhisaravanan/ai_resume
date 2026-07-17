const express = require("express");
const router = express.Router();

const db = require("../config/db");

console.log("🔥 Performance Route Loaded");

// ==============================
// Test Route
// ==============================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Performance Route Working",
  });
});

// ==============================
// Get Latest Performance
// GET /api/performance
// ==============================

router.get("/", (req, res) => {
  const sql = `
    SELECT
      ae.id,
      ae.technical_score,
      ae.relevance_score,
      ae.communication_score,
      ae.total_score,
      ae.feedback,
      ia.answer,
      ia.question_id
    FROM answer_evaluations ae
    JOIN interview_answers ia
      ON ia.id = ae.answer_id
    ORDER BY ae.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      performance: result,
    });
  });
});

// ==============================
// Get One Performance
// GET /api/performance/:answer_id
// ==============================

router.get("/:answer_id", (req, res) => {
  const answer_id = req.params.answer_id;

  const sql = `
    SELECT
      ia.question_id,
      ia.answer,
      ae.technical_score,
      ae.relevance_score,
      ae.communication_score,
      ae.total_score,
      ae.feedback

    FROM interview_answers ia

    JOIN answer_evaluations ae
      ON ia.id = ae.answer_id

    WHERE ia.id = ?
  `;

  db.query(sql, [answer_id], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      performance: result,
    });
  });
});

module.exports = router;
