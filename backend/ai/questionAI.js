// backend/ai/questionAI.js
const { callOllama } = require("./ollama"); // assuming ollama.js exports a function to chat with AI

/**
 * Generates dynamic technical questions based on the resume parsed skills.
 * @param {string} role
 * @param {Array<string>} skills
 * @returns {Promise<Array<string>>}
 */
async function generateDynamicQuestions(role, skills) {
  try {
    const skillsList = skills.join(", ");

    // Solid AI prompt to return exactly a JSON array of custom questions
    const prompt = `
      You are an expert technical interviewer. Create exactly 5 technical interview questions for a candidate applying for the role of "${role}".
      Their resume highlights these specific skills: [${skillsList}].
      
      Requirements:
      - The questions must strictly test their knowledge on: ${skillsList}.
      - Return ONLY a valid JSON array of strings containing the questions.
      - Do NOT include markdown formatting, backticks, introduction, explanations or numbering.
      - Example format: ["Question 1", "Question 2", "Question 3"]
    `;

    const aiResponse = await callOllama(prompt);

    // Clean and parse the JSON string from AI response
    let cleanResponse = aiResponse.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse.replace(/```json|```/g, "").trim();
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/```/g, "").trim();
    }

    const questionsArray = JSON.parse(cleanResponse);
    if (Array.isArray(questionsArray)) {
      return questionsArray;
    }

    throw new Error("AI did not return a valid array");
  } catch (error) {
    console.error("Error generating dynamic questions with Ollama:", error);

    // Fallback: If AI fails, dynamically create generic questions using their actual skills list
    return [
      `Can you explain your experience working with ${skills[0] || "your core skills"}?`,
      `What is the most challenging project you built using ${skills[1] || "your main technology"}?`,
      `How do you handle performance optimization in ${skills[2] || "development"}?`,
      `How do you keep up with best practices inside the ${role} domain?`,
      `Can you describe a situation where you had to debug a complex issue in ${skills[0] || "your stack"}?`,
    ];
  }
}

module.exports = {
  generateDynamicQuestions,
};
