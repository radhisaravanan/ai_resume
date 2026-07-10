const db = require("../config/db");

const parseResume = require("../services/resumeParser");
const extractSkills = require("../services/skillExtractor");
const generateQuestions = require("../services/questionGenerator");

const { saveQuestions } = require("../services/questionService");

exports.uploadResume = async (req, res) => {
  try {
    // Check if file uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    const userId = req.user.id;
    const fileName = req.file.filename;
    const filePath = req.file.path;

    // Save resume details into database
    const sql = `
            INSERT INTO resumes (user_id, file_name, file_path)
            VALUES (?, ?, ?)
        `;

    db.query(sql, [userId, fileName, filePath], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      try {
        // Parse Resume
        const resumeText = await parseResume(filePath);

        // Extract Skills
        const skills = extractSkills(resumeText);

        // Generate Questions
        const questions = generateQuestions(skills);

        // Save Questions
        saveQuestions(userId, skills, questions);

        return res.status(200).json({
          success: true,
          message: "Resume uploaded successfully",
          skills: skills,
          questions: questions,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
