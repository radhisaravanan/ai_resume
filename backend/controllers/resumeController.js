const db = require("../config/db");
const fs = require("fs");

const extractSkillsMock = async (filePath) => {
  return {
    detectedRole: "Frontend Developer",
    skills: ["React", "JavaScript", "HTML", "CSS", "REST APIs"],
  };
};

const analyzeResumeAndSetupSession = async (req, res) => {
  try {
    console.log("========== RESUME ANALYSIS START ==========");

    // Check uploaded file
    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({
        success: false,
        message: "No resume uploaded.",
      });
    }

    console.log("📄 Uploaded File:", req.file);

    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      console.log("❌ Uploaded file not found");
      return res.status(500).json({
        success: false,
        message: "Uploaded file not found.",
      });
    }

    // Get User ID
    let userId = req.user?.id || null;

    if (!userId) {
      console.log("⚠ No logged-in user. Fetching first user...");

      const users = await new Promise((resolve, reject) => {
        db.query("SELECT id FROM users LIMIT 1", (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      if (users.length === 0) {
        return res.status(500).json({
          success: false,
          message: "No users found in database.",
        });
      }

      userId = users[0].id;
    }

    console.log("✅ User ID:", userId);

    // AI Analysis
    const aiResult = await extractSkillsMock(req.file.path);

    console.log("🤖 AI Result:", aiResult);

    const sql = `
      INSERT INTO interview_sessions
      (user_id,target_role,targeted_skills)
      VALUES (?,?,?)
    `;

    db.query(
      sql,
      [
        userId,
        aiResult.detectedRole,
        JSON.stringify(aiResult.skills),
      ],
      (err, result) => {
        if (err) {
          console.error("========== DATABASE ERROR ==========");
          console.error(err);
          console.error("====================================");

          return res.status(500).json({
            success: false,
            message: err.sqlMessage || err.message,
          });
        }

        console.log("✅ Interview Session Created");

        return res.json({
          success: true,
          sessionId: result.insertId,
          detectedRole: aiResult.detectedRole,
          skills: aiResult.skills,
        });
      }
    );
  } catch (error) {
    console.error("========== SERVER ERROR ==========");
    console.error(error);
    console.error("==================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeResumeAndSetupSession,
};