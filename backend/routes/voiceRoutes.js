const express = require("express");
const router = express.Router();
console.log("🔥 NEW VOICE ROUTE ACTIVE");
const multer = require("multer");
const { exec } = require("child_process");

const db = require("../config/db");

// ==========================
// Audio Storage
// ==========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

// ==========================
// Upload + Whisper Speech To Text
// ==========================

router.post(
  "/upload",
  upload.single("audio"),

  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }

    const audioPath = req.file.path;

    exec(
      `python ai/speech_to_text.py "${audioPath}"`,

      (error, stdout, stderr) => {
        if (error) {
          console.log("Whisper Error:", error);

          return res.status(500).json({
            success: false,
            message: "Speech conversion failed",
          });
        }

        res.json({
          success: true,

          audio: req.file.filename,

          answer: stdout.trim(),
        });
      },
    );
  },
);

module.exports = router;
