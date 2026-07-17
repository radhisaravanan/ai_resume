const askOllama = require("./ollama");

async function analyzeResume(resumeText) {
  const prompt = `
You are an AI Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

{
  "candidateName": "",
  "skills": [],
  "experience": "",
  "education": "",
  "projects": [],
  "strengths": [],
  "difficulty": ""
}

Resume:

${resumeText}
`;

  try {
    const response = await askOllama(prompt);

    return JSON.parse(response);
  } catch (error) {
    console.error("Resume Analysis Error:", error.message);
    throw error;
  }
}

module.exports = analyzeResume;
