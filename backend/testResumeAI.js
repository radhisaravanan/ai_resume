const path = require("path");
const fs = require("fs");
const { parsePDFResume } = require("./services/resumeParser");
const db = require("./config/db");

const testPDFPath = path.join(__dirname, "uploads", "test-resume.pdf");

const runTest = async () => {
  console.log("=== STARTING RESUME PARSER & OLLAMA INTEGRATION TEST ===");

  if (!fs.existsSync(testPDFPath)) {
    console.error(
      `❌ Error: Put a sample PDF named 'test-resume.pdf' in: \n   ${path.join(__dirname, "uploads")}\n   to run this test.`,
    );
    process.exit(1);
  }

  try {
    console.log("1. Reading PDF file and extracting text using Python...");
    const text = await parsePDFResume(testPDFPath);
    console.log(`✅ Success! Extracted ${text.length} characters of text.\n`);
    console.log("Snippet from Resume:\n", text.slice(0, 300) + "...\n");

    console.log("2. Testing database connection...");
    // Direct call to ensure compatibility with either db.query or pool configurations
    const result = await db.execute("SELECT 1 + 1 AS solution");
    console.log("✅ Database responsive!\n");

    console.log(
      "🎉 All tests passed successfully! Start your server using 'node server.js'",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Test encountered an error:", error);
    process.exit(1);
  }
};

runTest();
