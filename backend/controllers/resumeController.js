const db = require("../config/db");

const extractSkillsMock = async (filePath) => {
  return {
    detectedRole: "Frontend Developer",
    skills: ["React", "JavaScript", "HTML", "CSS", "REST APIs"],
  };
};

const analyzeResumeAndSetupSession = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Capture the logged-in user ID if auth middleware is running, otherwise try to fetch the first available user ID
    let userId = req.user?.id;

    if (!userId) {
      // Fallback: Dynamically grab the first available user ID from the database to prevent foreign key issues
      const [firstUser] = await new Promise((resolve) => {
        db.query("SELECT id FROM users LIMIT 1", (err, results) => {
          if (!err && results.length > 0) resolve(results);
          else resolve([{ id: null }]);
        });
      });
      userId = firstUser.id;
    }

    const filePath = req.file.path;
    const aiOutput = await extractSkillsMock(filePath);
    const { detectedRole, skills } = aiOutput;

    // Build the query dynamically based on what fields exist
    const insertSessionSql = `
      INSERT INTO interview_sessions (user_id, target_role, targeted_skills) 
      VALUES (?, ?, ?)
    `;

    db.query(
      insertSessionSql,
      [userId, detectedRole, JSON.stringify(skills)],
      (err, result) => {
        if (err) {
          console.error("❌ Deeper Database Error Log:", err.message);

          // Send the EXACT database error reason directly to the frontend screen
          return res.status(500).json({
            success: false,
            message: `Database registration failed: ${err.message}. Please check your terminal.`,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Resume successfully analyzed!",
          sessionId: result.insertId,
          detectedRole,
          skills,
        });
      },
    );
  } catch (error) {
    console.error("Resume analysis controller error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  analyzeResumeAndSetupSession,
};
