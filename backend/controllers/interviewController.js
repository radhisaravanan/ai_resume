const db = require("../config/db");

// ===============================
// Start Interview
// ===============================
exports.startInterview = (req, res) => {
  const userId = req.user.id;

  const sql = "INSERT INTO interview_sessions(user_id) VALUES(?)";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      sessionId: result.insertId,
      message: "Interview Started",
    });
  });
};

// ===============================
// Get Random Question
// ===============================
exports.getQuestion = (req, res) => {
  const sql = `
    SELECT id, skill, question
    FROM interview_questions
    ORDER BY RAND()
    LIMIT 1
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.json({
        success: false,
        message: "No questions found",
      });
    }

    res.json({
      success: true,
      question: result[0],
    });
  });
};

// ===============================
// Save Answer
// ===============================
exports.submitAnswer = (req, res) => {
  const { user_id, question_id, answer } = req.body;

  const sql = `
    INSERT INTO interview_answers
    (user_id, question_id, answer)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [user_id, question_id, answer], (err) => {
    if (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      message: "Answer Saved",
    });
  });
};
