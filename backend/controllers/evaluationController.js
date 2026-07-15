// backend/controllers/evaluationController.js
const db = require("../config/db");

// Programmatic topic mapping to guarantee question variety
const TOPIC_MAPPING = {
  1: {
    category: "Frontend Fundamentals",
    focus: "JavaScript, ES6+, DOM manipulation, or asynchronous rendering",
  },
  2: {
    category: "State Management & Component Architecture",
    focus:
      "React State, Context API, Redux, or component re-rendering optimization",
  },
  3: {
    category: "Backend & API Design",
    focus: "Node.js, Express, RESTful routing, or routing middleware",
  },
  4: {
    category: "Database & Schema Design",
    focus:
      "SQL vs NoSQL choices, database normalization, indexing, or ODM/ORMs (like Mongoose/Prisma)",
  },
  5: {
    category: "Resume Project Deep-Dive",
    focus:
      "A specific major project, challenge, or architectural decision listed on their resume",
  },
  6: {
    category: "Performance Optimization",
    focus:
      "Frontend asset optimization, backend caching, lazy loading, or query speedups",
  },
  7: {
    category: "Testing & Debugging",
    focus:
      "Unit testing, integration testing, error handling boundaries, or production log management",
  },
  8: {
    category: "Web Security",
    focus:
      "JWT, Session management, CORS, password hashing, or OWASP top 10 vulnerabilities",
  },
  9: {
    category: "Deployment & Systems",
    focus:
      "Docker, CI/CD pipelines, Git workflows, cloud hosting, or environment configurations",
  },
  10: {
    category: "Engineering Behavioral & Agile",
    focus:
      "Dealing with technical debt, code reviews, agile sprints, or collaborating with non-technical stakeholders",
  },
};

exports.generateNextQuestion = async (req, res) => {
  const OLLAMA_URL =
    process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";
  const MODEL_NAME = process.env.OLLAMA_MODEL || "qwen3:8b";

  try {
    const userId = req.user && req.user.id ? req.user.id : 1;
    const { questionNumber, askedQuestions } = req.body;

    // Default Fallback questions to guarantee NO repeats even if Ollama fails entirely
    const fallbackQuestions = {
      1: "Can you explain the difference between let, const, and var in modern JavaScript?",
      2: "How do you decide when to use local React state versus a global state management solution?",
      3: "How do you design a robust RESTful API endpoint structure for nested resources?",
      4: "Explain when you would choose a relational database over a NoSQL database.",
      5: "Describe a complex technical challenge you solved in one of your recent projects.",
      6: "What strategies do you use to optimize a slow-loading web application?",
      7: "How do you write unit tests for asynchronous code blocks?",
      8: "What are some best practices for securing JWT tokens in a web application?",
      9: "Can you describe your ideal CI/CD pipeline deployment workflow?",
      10: "How do you manage communication and technical debt in an Agile development environment?",
    };

    // Fetch candidate resume contents
    let resumeText = "React, Node.js, JavaScript, Web Developer";
    try {
      const [resumeRows] = await db.execute(
        "SELECT resume_text FROM resumes WHERE user_id = ? ORDER BY id DESC LIMIT 1",
        [userId],
      );
      if (resumeRows && resumeRows.length > 0) {
        resumeText = resumeRows[0].resume_text;
      }
    } catch (dbErr) {
      console.warn(
        "[Next Question] Could not fetch user resume, using fallback profile.",
      );
    }

    const currentTopicConfig = TOPIC_MAPPING[questionNumber] || {
      category: "Full Stack Engineering",
      focus: "General software development practices",
    };

    const previousQuestionsList =
      Array.isArray(askedQuestions) && askedQuestions.length > 0
        ? askedQuestions.map((q, i) => `[Question ${i + 1}]: "${q}"`).join("\n")
        : "None";

    const cacheBuster = Math.random().toString(36).substring(7);
    const currentTime = new Date().toISOString();

    const prompt = `
      You are an expert technical interviewer conducting a highly structured 10-question technical interview.
      Candidate's Resume Details: "${resumeText.substring(0, 1000)}"

      The candidate is currently on Question #${questionNumber} of 10.
      Current Focus Category: ${currentTopicConfig.category}
      Target Technical Focus Area: ${currentTopicConfig.focus}
      Session Timestamp: ${currentTime}
      Cache Bypass Code: ${cacheBuster}

      ====================================
      CRITICAL SAFETY DIRECTIVES:
      - You MUST generate a technical interview question specifically targeting the Category: "${currentTopicConfig.category}" and Focus: "${currentTopicConfig.focus}".
      - You are strictly FORBIDDEN from asking about topics outside of this designated focus.
      - Do NOT ask questions semantically related to:
      ${previousQuestionsList}
      ====================================

      Generate Question #${questionNumber} of 10 based on their resume skills matching the designated category focus. Keep it professional, highly focused, and direct.

      Return ONLY the raw question text. Do not include introductory text, conversational filler, markdown formatting, tags, or question numbers.
    `;

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.9,
          presence_penalty: 2.0,
          frequency_penalty: 2.0,
        },
      }),
    });

    if (!response.ok) throw new Error("Ollama generation error.");

    const data = await response.json();
    const generatedQuestion = data.response.trim();

    return res.status(200).json({
      success: true,
      question: generatedQuestion || fallbackQuestions[questionNumber],
    });
  } catch (error) {
    console.error("❌ [Next Question] Error generating:", error);
    return res.status(200).json({
      success: true,
      question:
        fallbackQuestions[questionNumber] ||
        "Could you tell me how you optimize application performance?",
    });
  }
};
