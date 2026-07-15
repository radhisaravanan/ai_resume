// backend/controllers/voiceController.js
const { spawn } = require("child_process");
const path = require("path");
const db = require("../config/db");

const processVoiceAnswer = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No audio file uploaded." });
    }

    const audioFilePath = req.file.path;

    // Safety check: Ensure userId never resolves to undefined!
    let userId = 1; // Default fallback to user ID 1 for testing
    if (req.user && req.user.id !== undefined && req.user.id !== null) {
      userId = req.user.id;
    }

    let { question } = req.body;
    // Fallback if frontend didn't send a question text
    if (!question || question === "undefined") {
      question = "What are the advantages of using React Hooks?";
    }

    console.log(`[Voice System] Audio received: ${req.file.filename}`);
    console.log(`[Voice System] Using User ID: ${userId}`);

    // Spawn Whisper transcription process
    const scriptPath = path.join(__dirname, "../ai/speech_to_text.py");
    const pythonProcess = spawn("python", [scriptPath, audioFilePath]);

    let transcript = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      transcript += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error(`[Voice System] Whisper error: ${errorOutput}`);
        return res
          .status(500)
          .json({ success: false, message: "STT failed.", error: errorOutput });
      }

      const finalTranscript = transcript.trim();
      console.log(`[Voice System] Transcript: "${finalTranscript}"`);

      try {
        let targetQuestionId = null;

        // 1. Search if the active question already exists for this user
        const questionsResult = await db.execute(
          "SELECT id FROM interview_questions WHERE question = ? AND user_id = ? LIMIT 1",
          [question, userId],
        );

        // Safely extract rows across different mysql2 configurations
        const questionsRows = Array.isArray(questionsResult)
          ? questionsResult[0]
          : questionsResult.rows || [];

        if (questionsRows && questionsRows.length > 0) {
          targetQuestionId = questionsRows[0].id;
        } else {
          // If the question doesn't exist yet, insert it to keep database relations intact
          const newQuestionResult = await db.execute(
            "INSERT INTO interview_questions (user_id, skill, question) VALUES (?, ?, ?)",
            [userId, "React", question],
          );

          targetQuestionId = Array.isArray(newQuestionResult)
            ? newQuestionResult[0].insertId
            : newQuestionResult.insertId || newQuestionResult.insert_id;
        }

        // Final safety guarantee: Ensure none of these are undefined before binding
        const safeUserId = userId || 1;
        const safeQuestionId = targetQuestionId || 1;
        const safeAnswerText =
          finalTranscript || "No audible response captured.";

        console.log(
          `[Voice System] Inserting Answer -> User: ${safeUserId}, Question ID: ${safeQuestionId}`,
        );

        // 2. Insert into interview_answers using your exact schema columns
        const sql = `
          INSERT INTO interview_answers (user_id, question_id, answer, score) 
          VALUES (?, ?, ?, 0)
        `;

        const insertResult = await db.execute(sql, [
          safeUserId,
          safeQuestionId,
          safeAnswerText,
        ]);

        const finalInsertId = Array.isArray(insertResult)
          ? insertResult[0].insertId
          : insertResult.insertId;

        return res.status(200).json({
          success: true,
          message: "Voice transcript captured successfully.",
          answerId: finalInsertId,
          transcript: finalTranscript,
        });
      } catch (dbError) {
        console.error("❌ [Voice System] Database insertion crashed:", dbError);
        return res.status(500).json({
          success: false,
          message: `Database save failed. MySQL Error: ${dbError.message}`,
          transcript: finalTranscript,
        });
      }
    });
  } catch (error) {
    console.error("[Voice System] Global execution failure:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal processing crash." });
  }
};

module.exports = { processVoiceAnswer };
