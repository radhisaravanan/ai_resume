const axios = require("axios");
const pdfParse = require("pdf-parse");

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
      return res
        .status(400)
        .json({ success: false, error: "Empty resume text data content." });
    }

    const cleanText = rawText.replace(/[\r\n]+/g, " ").substring(0, 2000);
    const keywords = cleanText.match(
      /\b(react|node|javascript|python|sql|java|html|css|aws|docker)\b/gi,
    ) || ["Software Engineering"];
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
