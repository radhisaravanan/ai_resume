const db = require("../config/db");

// ======================================
// Start Interview
// ======================================
exports.startInterview = (req, res) => {
  const userId = req.user.id;

  const sql = `
    INSERT INTO interview_sessions
    (user_id, total_questions, current_question, status, score)
    VALUES (?, 5, 1, 'Started', 0)
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      sessionId: result.insertId,
      message: "Interview Started Successfully",
    });
  });
};

// ======================================
// Get Current Question
// ======================================
exports.getQuestion = (req, res) => {
  const sessionId = req.params.sessionId;

  db.query(
    "SELECT current_question,total_questions FROM interview_sessions WHERE id=?",
    [sessionId],
    (err, session) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (session.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Session Not Found",
        });
      }

      const current = session[0].current_question;
      const total = session[0].total_questions;

      if (current > total) {
        return res.json({
          success: true,
          completed: true,
          message: "Interview Completed",
        });
      }

      db.query(
        "SELECT id, question FROM interview_questions LIMIT ?,1",
        [current - 1],
        (err, question) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          if (question.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Question Not Found",
            });
          }

          res.json({
            success: true,
            question: question[0],
          });
        },
      );
    },
  );
};

// ======================================
// Save Answer
// ======================================
exports.submitAnswer = (req, res) => {
  const { session_id, question_id, answer } = req.body;

  db.query(
    "SELECT user_id,current_question,total_questions FROM interview_sessions WHERE id=?",
    [session_id],
    (err, session) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (session.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Session Not Found",
        });
      }

      const userId = session[0].user_id;

      db.query(
        "INSERT INTO interview_answers(user_id,question_id,answer) VALUES(?,?,?)",
        [userId, question_id, answer],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          db.query(
            "UPDATE interview_sessions SET current_question=current_question+1 WHERE id=?",
            [session_id],
            (err2) => {
              if (err2) {
                return res.status(500).json({
                  success: false,
                  message: err2.message,
                });
              }

              res.json({
                success: true,
                answer_id: result.insertId,
                message: "Answer Saved Successfully",
              });
            },
          );
        },
      );
    },
  );
};

// ======================================
// Interview History
// ======================================
exports.getInterviewHistory = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
      id AS session_id,
      created_at,
      status,
      score
    FROM interview_sessions
    WHERE user_id=?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      history: result,
    });
  });
};
