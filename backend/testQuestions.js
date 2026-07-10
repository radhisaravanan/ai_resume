const generateQuestions = require("./services/questionGenerator");

const skills = [
    "React",
    "Node.js",
    "PHP",
    "MySQL"
];

const questions = generateQuestions(skills);

console.log(questions);