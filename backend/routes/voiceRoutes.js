const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const voiceController = require("../controllers/voiceController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("🔥 NEW VOICE ROUTE ACTIVE");

// Configure disk storage engine to stream incoming recordings to standard uploads path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    // Generate a clean filename preserving original extensions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "audio-" + uniqueSuffix + path.extname(file.originalname || ".wav"),
    );
  },
});

const upload = multer({ storage: storage });

// Safely debug missing handlers before mounting to prevent crashes
if (!voiceController || !voiceController.processVoiceAnswer) {
  console.error(
    "❌ ERROR: voiceController.processVoiceAnswer is not defined! Double-check exports.",
  );
}

// Secure voice ingestion pipeline protected by user JWT state validation
router.post(
  "/upload",
  authMiddleware,
  upload.single("audio"),
  voiceController.processVoiceAnswer,
);

module.exports = router;
