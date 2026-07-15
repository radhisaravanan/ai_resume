const askOllama = require("./ollama");

async function generateQuestions(resumeData) {
  const prompt = `
You are an AI Technical Interviewer.

Candidate Skills:
${resumeData.skills.join(", ")}

Generate ONLY 5 interview questions.

Return ONLY JSON.

{
  "questions":[
    {
      "skill":"React",
      "difficulty":"Easy",
      "question":"What is React?"
    }
  ]
}

Do not explain anything.
Do not use markdown.
`;

  try {
    const response = await askOllama(prompt);

    console.log("\nRaw Response:\n");
    console.log(response);

    const clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

module.exports = generateQuestions;
