const knownSkills = [
  "Java",
  "JavaScript",
  "React",
  "Node.js",
  "Express",
  "PHP",
  "MySQL",
  "MongoDB",
  "Python",
  "HTML",
  "CSS",
  "Bootstrap",
  "C",
  "C++",
  "C#",
  "SQL",
  "Git",
  "GitHub",
];

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSkills(text) {
  const foundSkills = [];

  knownSkills.forEach((skill) => {
    const regex = new RegExp("\\b" + escapeRegex(skill) + "\\b", "i");

    if (regex.test(text)) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
}

module.exports = extractSkills;
