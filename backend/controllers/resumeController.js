const db = require("../config/db");
const fs = require("fs");
const pdfParse = require("pdf-parse");

/* ===========================================
   Cleanup Uploaded File
=========================================== */

function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Cleanup Error:", err.message);
  }
}

/* ===========================================
   Mock AI Skill Extraction
=========================================== */

async function extractSkillsMock(filePath) {
  const buffer = fs.readFileSync(filePath);

  const pdf = await pdfParse(buffer);

  const text = pdf.text.toLowerCase();

  let skills = [];

  const skillList = [
    "javascript",
    "react",
    "node",
    "express",
    "html",
    "css",
    "mysql",
    "mongodb",
    "python",
    "java",
    "c",
    "c++",
    "php",
    "bootstrap",
    "tailwind",
    "git",
    "github",
    "sql",
    "api",
    "firebase"
  ];

  skillList.forEach((skill) => {
    if (text.includes(skill)) {
      skills.push(skill);
    }
  });

  let detectedRole = "Software Engineer";

  if (text.includes("react")) {
    detectedRole = "Frontend Developer";
  }

  if (text.includes("node")) {
    detectedRole = "Backend Developer";
  }

  if (
    text.includes("react") &&
    text.includes("node")
  ) {
    detectedRole = "Full Stack Developer";
  }

  if (text.includes("python")) {
    detectedRole = "Python Developer";
  }

  if (text.includes("java")) {
    detectedRole = "Java Developer";
  }

  if (skills.length === 0) {
    skills = [
      "Communication",
      "Problem Solving"
    ];
  }

  return {
    detectedRole,
    skills,
    extractedText: pdf.text
  };
}

/* ===========================================
   Analyze Resume
=========================================== */

async function analyzeResumeAndSetupSession(req, res) {

  let filePath = null;

  try {

    console.log("========== Resume Analysis ==========");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume."
      });
    }

    filePath = req.file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        message: "Uploaded file not found."
      });
    }

    let userId = req.user?.id;

    if (!userId) {

      const users = await new Promise((resolve, reject) => {

        db.query(
          "SELECT id FROM users LIMIT 1",
          (err, result) => {

            if (err) return reject(err);

            resolve(result);

          }
        );

      });

      if (users.length === 0) {

        cleanupFile(filePath);

        return res.status(500).json({
          success: false,
          message: "No users found."
        });

      }

      userId = users[0].id;

    }

    console.log("User:", userId);

    const aiResult = await extractSkillsMock(filePath);

    const sql = `
      INSERT INTO interview_sessions
      (
        user_id,
        target_role,
        targeted_skills
      )
      VALUES
      (
        ?, ?, ?
      )
    `;

    db.query(

      sql,

      [
        userId,
        aiResult.detectedRole,
        JSON.stringify(aiResult.skills)
      ],

      (err, result) => {

        cleanupFile(filePath);

        if (err) {

          console.error(err);

          return res.status(500).json({

            success: false,

            message: err.sqlMessage || err.message

          });

        }

        return res.json({

          success: true,

          message: "Resume analyzed successfully.",

          sessionId: result.insertId,

          detectedRole: aiResult.detectedRole,

          skills: aiResult.skills,

          extractedText: aiResult.extractedText.substring(0, 3000)

        });

      }

    );

  }

  catch (error) {

    cleanupFile(filePath);

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

}

module.exports = {

  analyzeResumeAndSetupSession

};