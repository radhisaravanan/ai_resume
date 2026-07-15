console.log("File Started");

const generateReport = require("./ai/reportAI");

console.log("Module Loaded");

const evaluations = [
  {
    question: "What is React?",
    score: 9,
    feedback: "Excellent answer",
  },
  {
    question: "Explain useEffect.",
    score: 8,
    feedback: "Good understanding",
  },
];

async function test() {
  console.log("Function Started");

  try {
    const report = await generateReport("Radhika", evaluations);

    console.log("AI Report:");
    console.log(report);
  } catch (err) {
    console.error(err);
  }

  console.log("Function Finished");
}

test();
