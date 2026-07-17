const askOllama = require("./ollama");

async function generateReport(candidateName, evaluations) {
  const prompt = `
You are an expert HR interviewer.

Candidate Name:
${candidateName}

Interview Evaluation:
${JSON.stringify(evaluations, null, 2)}

Generate ONLY valid JSON.

{
  "overallScore": 0,
  "technicalScore": 0,
  "communicationScore": 0,
  "confidence": "",
  "strengths": [],
  "weaknesses": [],
  "recommendation": "",
  "summary": ""
}

Rules:
- overallScore must be between 0 and 100.
- technicalScore must be between 0 and 100.
- communicationScore must be between 0 and 100.
- confidence should be Low, Medium or High.
- recommendation should be one of:
  - Selected
  - Needs Improvement
  - Rejected
- Return ONLY JSON.
`;

  try {
    console.log("Generating AI Report...");

    const response = await askOllama(prompt);

    console.log("\nRaw AI Response:\n");
    console.log(response);

    const clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch (error) {
    console.log("Report Generation Error:");
    console.log(error.message);

    throw error;
  }
}

module.exports = generateReport;
