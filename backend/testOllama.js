const askOllama = require("./ai/ollama");

async function testOllama() {
  console.log("==================================");
  console.log("Testing Ollama Connection...");
  console.log("==================================");

  try {
    const prompt = `
You are an AI interviewer.

Question:
What is React?

Answer in less than 80 words.
`;

    const result = await askOllama(prompt);

    console.log("\n========== AI RESPONSE ==========\n");

    console.log(result);

    console.log("\n==================================");
    console.log("Ollama Working Successfully ✅");
    console.log("==================================");
  } catch (error) {
    console.log("\n==================================");
    console.log("Test Failed ❌");
    console.log("==================================");

    console.log(error.message);
  }
}

testOllama();
