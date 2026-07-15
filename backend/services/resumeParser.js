// backend/services/resumeParser.js
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Extracts raw text from an uploaded PDF resume using a local Python script
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} - The extracted plain text
 */
const parsePDFResume = (filePath) => {
  return new Promise((resolve, reject) => {
    // We will create this helper Python file in the next step
    const scriptPath = path.join(__dirname, "../ai/pdf_parser.py");

    if (!fs.existsSync(filePath)) {
      return reject(new Error(`PDF file not found at: ${filePath}`));
    }

    const pythonProcess = spawn("python", [scriptPath, filePath]);

    let extractedText = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      extractedText += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(
          `[PDF Parser] Python script exited with code ${code}. Error: ${errorOutput}`,
        );
        return reject(
          new Error(
            "Failed to extract text from PDF. Check python dependencies.",
          ),
        );
      }
      resolve(extractedText.trim());
    });
  });
};

module.exports = { parsePDFResume };
