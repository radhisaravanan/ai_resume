const questionBank = {
  React: ["What are React Hooks?", "Explain useState()"],

  "Node.js": ["What is Express.js?", "Explain middleware."],

  PHP: ["Difference between GET and POST?", "What are Sessions?"],

  MySQL: ["What is Normalization?", "Explain JOIN."],

  HTML: ["What are Semantic Tags?"],

  CSS: ["What is Flexbox?"],

  JavaScript: ["Difference between var, let and const?"],
};

function generateQuestions(skills) {
  let questions = [];

  skills.forEach((skill) => {
    if (questionBank[skill]) {
      questionBank[skill].forEach((q) => {
        questions.push({
          skill: skill,
          question: q,
        });
      });
    }
  });

  return questions;
}

module.exports = generateQuestions;
