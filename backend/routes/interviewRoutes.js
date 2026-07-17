const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const interviewController = require("../controllers/interviewController");

// Configure temporary in-memory allocation for file handling
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Strictly block any file format that isn't a PDF container
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF formats are parsed by the analyzer!"), false);
    }
  },
});

// 📁 NEW: Dynamic Resume Analyzer Endpoint Context Block
router.post("/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    console.log(
      "📡 [Server] Resume parsing context payload analysis triggered.",
    );

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file attached. Please upload a valid document.",
      });
    }

    // Parse the incoming binary buffer into a raw text string
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "The uploaded PDF contains no readable text layers.",
      });
    }

    console.log(
      `✅ [Server] Resume processed successfully (${extractedText.trim().length} characters parsed).`,
    );
    return res.status(200).json({
      success: true,
      extractedText: extractedText.trim(),
    });
  } catch (err) {
    console.error("❌ PDF Parser Error Core Exception:", err.message);
    return res.status(500).json({
      success: false,
      error:
        "Failed to parse structural document contents during file processing operations.",
    });
  }
});

// 🚀 Existing: Dashboard "Start Interview" initialization session endpoint
router.post("/start", async (req, res) => {
  try {
    console.log(
      "📡 [Server] Interview session initialization sequence requested.",
    );

    return res.status(200).json({
      success: true,
      message: "Interview session started successfully.",
      nextQuestionId: 1,
    });
  } catch (error) {
    console.error("❌ Interview session startup error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal validation server error during session boot.",
    });
  }
});

// Your dynamic AI generation endpoints
router.post("/question", interviewController.generateQuestion);
router.post("/answer", interviewController.saveAnswerAndEvaluate);

module.exports = router;
