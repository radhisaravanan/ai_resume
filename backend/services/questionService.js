const db = require("../config/db");

exports.saveQuestions = async (userId, skills, questions) => {
  try {
    if (!questions || questions.length === 0) {
      console.log("No questions to save.");
      return;
    }

    for (const item of questions) {
      const sql = `
        INSERT INTO interview_questions
        (user_id, skill, question)
        VALUES (?, ?, ?)
      `;

      await new Promise((resolve, reject) => {
        db.query(
          sql,
          [userId, item.skill || "General", item.question],
          (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          },
        );
      });
    }

    console.log("✅ All AI questions saved successfully.");
  } catch (error) {
    console.error("Question Save Error:", error.message);
    throw error;
  }
};
