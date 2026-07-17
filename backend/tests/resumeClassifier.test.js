const test = require("node:test");
const assert = require("node:assert/strict");
const {
  classifyResumeText,
  buildResumeAnalysisResponse,
} = require("../services/resumeClassifier");

test("rejects non-resume content with the required payload", () => {
  const result = classifyResumeText(
    "This is a general essay about history and philosophy.",
  );

  assert.equal(result.isValidResume, false);
  assert.equal(
    result.errorMessage,
    "This document does not qualify as a valid professional resume. Please upload a properly formatted CV.",
  );
});

test("generates five grounded questions for a valid resume", () => {
  const resumeText = `
  Jane Doe
  Senior Frontend Engineer
  Summary: Built React and Redux applications for enterprise dashboards.
  Experience
  2022-2024 Senior Frontend Engineer at Northwind, led React and TypeScript features.
  Projects
  - Expense Tracker: React, Redux, Node.js, Express, PostgreSQL.
  Education
  B.S. Computer Science
  Skills: React, TypeScript, Node.js, PostgreSQL, Docker
  `;

  const result = buildResumeAnalysisResponse(resumeText);

  assert.equal(result.isValidResume, true);
  assert.equal(result.errorMessage, null);
  assert.equal(result.generatedInterviewQuestions.length, 5);
  result.generatedInterviewQuestions.forEach((item, index) => {
    assert.equal(item.questionNumber, index + 1);
    assert.ok(item.targetSkillOrProject);
    assert.ok(item.questionText);
    assert.ok(!item.questionText.includes("What is React Hooks?"));
  });
});
