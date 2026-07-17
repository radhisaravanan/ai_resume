const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { buildResumeAnalysisResponse } = require("../services/resumeClassifier");

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
    if (!req.file) {
      return res.status(400).json({
        isValidResume: false,
        errorMessage:
          "This document does not qualify as a valid professional resume. Please upload a properly formatted CV.",
      });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text ? pdfData.text.trim() : "";
    const analysis = buildResumeAnalysisResponse(extractedText);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Backend PDF parser failure trace:", error);
    return res.status(400).json({
      isValidResume: false,
      errorMessage:
        "This document does not qualify as a valid professional resume. Please upload a properly formatted CV.",
    });
  }
});

module.exports = router;
