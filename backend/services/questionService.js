const db = require("../config/db");

exports.saveQuestions = (userId, skills, questions) => {
  questions.forEach((item) => {
    const sql = `
      INSERT INTO interview_questions
      (user_id, skill, question)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [userId, item.skill, item.question], (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });
};
