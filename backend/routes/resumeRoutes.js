const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");

// 📦 Setup binary processing memory storage boundaries
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @route   POST /api/resume/upload
 * @desc    Upload candidate portfolio and extract text parameters dynamically
 * @access  Public
 */
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // 🔍 Verification 1: Buffer file dynamic payload validation check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File processing breakdown. No file stream buffer captured.",
      });
    }

    // ⚙️ Process 2: Safe memory parsing directly via pdf-parse module
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.toLowerCase();

    // 🔍 Process 3: Standard technical keyword match scanning engine
    const skillKeywords = [
      "javascript",
      "react",
      "node",
      "mysql",
      "python",
      "java",
      "html",
      "css",
      "php",
    ];
    const foundSkills = [];

    skillKeywords.forEach((skill) => {
      if (extractedText.includes(skill)) {
        foundSkills.push(skill.toUpperCase());
      }
    });

    const skills = foundSkills.length > 0 ? foundSkills : ["GENERAL TECHNICAL METRICS"];
    const summary = `Candidate demonstrates strong technical foundational capabilities with direct alignment in ${skills.slice(0, 3).join(", ")}.`;

    // 🚀 Success execution response — returns both `skills` (new) and `extractedSkills` (legacy compat)
    return res.status(200).json({
      success: true,
      message: "Resume evaluation matrix completed successfully!",
      skills,
      summary,
      rawText: extractedText,
      extractedSkills: skills,
    });
  } catch (error) {
    console.error("Backend PDF parser failure trace:", error);
    return res.status(500).json({
      success: false,
      message: "Extraction failed layers context parsing error logic.",
    });
  }
});

module.exports = router;
