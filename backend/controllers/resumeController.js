const db = require("../config/db");
const fs = require("fs");
const pdfParse = require("pdf-parse");

function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Cleanup Error:", err.message);
  }
}

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
    "firebase",
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

  if (text.includes("react") && text.includes("node")) {
    detectedRole = "Full Stack Developer";
  }

  if (text.includes("python")) {
    detectedRole = "Python Developer";
  }

  if (text.includes("java")) {
    detectedRole = "Java Developer";
  }

  if (skills.length === 0) {
    skills = ["Communication", "Problem Solving"];
  }

  return {
    detectedRole,
    skills,
    extractedText: pdf.text,
  };
}

exports.analyzeResume = async (req, res) => {
  try {
    let rawText = "";

    if (req.file) {
      const parsed = await pdfParse(req.file.buffer);
      rawText = parsed.text ? parsed.text.trim() : "";
    } else if (req.body.manualText) {
      rawText = req.body.manualText.trim();
    }

    if (!rawText || rawText.length < 10) {
      return res.status(400).json({ success: false, error: "Empty resume text data content." });
    }

    const cleanText = rawText.replace(/[\r\n]+/g, " ").substring(0, 2000);
    const keywords = cleanText.match(/\b(react|node|javascript|python|sql|java|html|css|aws|docker)\b/gi) || ["Software Engineering"];
    const uniqueSkills = [...new Set(keywords.map((s) => s.toUpperCase()))];
    const summary = `Candidate shows strong engineering foundational capabilities with direct alignment in fields like ${uniqueSkills.slice(0, 3).join(", ")}.`;

    return res.status(200).json({
      success: true,
      summary,
      skills: uniqueSkills,
      rawText: cleanText,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

async function analyzeResumeAndSetupSession(req, res) {
  let filePath = null;

  try {
    console.log("========== Resume Analysis ==========");

    if (!req.file && !req.body.manualText) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume or provide manual text.",
      });
    }

    let userId = req.user?.id;
    let aiResult = null;

    if (req.file) {
      filePath = req.file.path || null;

      if (req.file.buffer) {
        const parsed = await pdfParse(req.file.buffer);
        const extractedText = parsed.text || "";
        const normalizedText = extractedText.toLowerCase();
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
          "firebase",
        ];

        const skills = skillList.filter((skill) => normalizedText.includes(skill));
        let detectedRole = "Software Engineer";

        if (normalizedText.includes("react")) detectedRole = "Frontend Developer";
        if (normalizedText.includes("node")) detectedRole = "Backend Developer";
        if (normalizedText.includes("react") && normalizedText.includes("node")) detectedRole = "Full Stack Developer";
        if (normalizedText.includes("python")) detectedRole = "Python Developer";
        if (normalizedText.includes("java")) detectedRole = "Java Developer";

        aiResult = {
          detectedRole,
          skills: skills.length > 0 ? skills : ["Communication", "Problem Solving"],
          extractedText,
        };
      } else if (filePath && fs.existsSync(filePath)) {
        aiResult = await extractSkillsMock(filePath);
      } else {
        return res.status(500).json({
          success: false,
          message: "Uploaded file not found.",
        });
      }
    } else {
      const cleanText = req.body.manualText.trim();
      const keywords = cleanText.match(/\b(react|node|javascript|python|sql|java|html|css|aws|docker)\b/gi) || ["Software Engineering"];
      const uniqueSkills = [...new Set(keywords.map((s) => s.toUpperCase()))];

      aiResult = {
        detectedRole: "Software Engineer",
        skills: uniqueSkills,
        extractedText: cleanText,
      };
    }

    if (!userId) {
      const users = await new Promise((resolve, reject) => {
        db.query("SELECT id FROM users LIMIT 1", (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      if (users.length === 0) {
        cleanupFile(filePath);
        return res.status(500).json({ success: false, message: "No users found." });
      }

      userId = users[0].id;
    }

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

    db.query(sql, [userId, aiResult.detectedRole, JSON.stringify(aiResult.skills)], (err, result) => {
      cleanupFile(filePath);

      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage || err.message,
        });
      }

      return res.json({
        success: true,
        message: "Resume analyzed successfully.",
        sessionId: result.insertId,
        detectedRole: aiResult.detectedRole,
        skills: aiResult.skills,
        extractedText: aiResult.extractedText.substring(0, 3000),
        summary: `Candidate shows strong engineering foundational capabilities with direct alignment in fields like ${aiResult.skills.slice(0, 3).join(", ")}.`,
      });
    });
  } catch (error) {
    cleanupFile(filePath);
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  analyzeResume,
  analyzeResumeAndSetupSession,
};
