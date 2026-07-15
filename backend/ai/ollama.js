const axios = require("axios");

async function askOllama(prompt) {
  const response = await axios.post(
    "http://127.0.0.1:11434/api/generate",
    {
      model: "qwen3:8b",
      prompt,
      stream: false,
      think: false,
      options: {
        temperature: 0.3,
        num_predict: 400,
      },
    },
    {
      timeout: 180000,
    },
  );

  return response.data.response;
}

module.exports = askOllama;
