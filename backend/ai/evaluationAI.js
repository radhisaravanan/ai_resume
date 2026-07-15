const askOllama = require("./ollama");

async function evaluateAnswer(question, answer) {
  const prompt = `
You are a senior technical interviewer.

Evaluate the candidate's answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY JSON.

{
  "score": 0,
  "feedback": "",
  "strengths": [],
  "improvements": []
}

Rules:
- Score must be between 0 and 10.
- Feedback should be short.
- Mention strengths.
- Mention improvements.
- Return JSON only.
`;

  try {
    const response = await askOllama(prompt);

    const clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch (error) {
    console.log("Evaluation Error:", error.message);
    throw error;
  }
}

module.exports = evaluateAnswer;
