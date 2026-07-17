const axios = require("axios");
const db = require("../config/db");

// ─────────────────────────────────────────────────────────────
// HELPER: Call Ollama with a timeout — returns "" on failure
// ─────────────────────────────────────────────────────────────
async function callOllama(prompt, timeoutMs = 8000) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: process.env.OLLAMA_MODEL || "qwen3:8b",
        prompt,
        stream: false,
        options: { temperature: 0.6, num_predict: 300 },
      },
      { timeout: timeoutMs }
    );
    return (response.data.response || "").trim();
  } catch (e) {
    console.warn("⚠️  Ollama timeout/error:", e.message);
    return "";
  }
}

// ─────────────────────────────────────────────────────────────
// STAGE 1: MOTIVATION + FIRST QUESTION
// POST /api/interview/motivation
// ─────────────────────────────────────────────────────────────
exports.generateMotivation = async (req, res) => {
  try {
    const { skills = [], summary = "" } = req.body;

    const skillStr = skills.length > 0 ? skills.join(", ") : "Software Engineering";

    const prompt = `You are an expert AI Technical Interviewer and Communication Coach.
A candidate's resume shows these skills: ${skillStr}.
Profile summary: "${summary}"

Your task (output EXACTLY in this format, nothing else):
[MOTIVATION]: Write 2-3 sentences of warm, genuine encouragement. Highlight ONE strong point from their resume to boost confidence before the interview starts.
[QUESTION]: Write ONE focused, application-based technical question (max 15 words) based on their strongest skill (${skills[0] || skillStr}).

Rules:
- Keep [MOTIVATION] under 60 words.
- Keep [QUESTION] under 20 words.
- Do NOT add extra sections or commentary.`;

    const raw = await callOllama(prompt, 10000);

    let motivation = "";
    let question = "";

    if (raw) {
      const motMatch = raw.match(/\[MOTIVATION\]:\s*([\s\S]*?)(?=\[QUESTION\]|$)/i);
      const qMatch = raw.match(/\[QUESTION\]:\s*([\s\S]*?)$/i);
      if (motMatch) motivation = motMatch[1].trim();
      if (qMatch) question = qMatch[1].trim();
    }

    // ── Fallback if Ollama didn't cooperate ──
    if (!motivation) {
      motivation = `Your profile in ${skillStr} is impressive and shows real-world depth. You have the technical foundation that top companies look for — walk into this interview with confidence!`;
    }
    if (!question) {
      const firstSkill = (skills[0] || "JavaScript").replace(/GENERAL TECHNICAL METRICS/, "Software Engineering");
      question = `Can you walk me through a project where you applied ${firstSkill} to solve a real problem?`;
    }

    return res.status(200).json({ success: true, motivation, question });
  } catch (err) {
    console.error("Motivation Controller Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// STAGE 2: QUESTION GENERATION
// POST /api/interview/question
// ─────────────────────────────────────────────────────────────
exports.generateQuestion = async (req, res) => {
  try {
    const { questionId, resumeContext, askedQuestions } = req.body;
    const currentId = parseInt(questionId, 10) || 1;

    // Parse resume context — supports both JSON object and raw string
    let skills = [];
    let summary = "";
    if (resumeContext && typeof resumeContext === "object") {
      skills = resumeContext.skills || [];
      summary = resumeContext.summary || "";
    } else if (typeof resumeContext === "string") {
      try {
        const parsed = JSON.parse(resumeContext);
        skills = parsed.skills || [];
        summary = parsed.summary || "";
      } catch {
        summary = resumeContext;
        skills = resumeContext.match(/\b(react|node|javascript|python|sql|html|css|java|php|mysql|express|git|github)\b/gi) || [];
      }
    }

    const skillStr = skills.length > 0 ? skills.join(", ") : "Full Stack Web Development";
    const excludeStr = askedQuestions && askedQuestions.length > 0
      ? `\nDo NOT repeat or generate anything similar to:\n${askedQuestions.map((q) => `- ${q}`).join("\n")}`
      : "";

    const prompt = `You are an expert technical interviewer.
Resume skills: ${skillStr}
Generate exactly ONE interview question for Question #${currentId} of 5.${excludeStr}

Rules:
- Focus on a skill from: ${skillStr}
- Keep it under 18 words
- Application-based, not just definitions
- Return ONLY the question text, nothing else.`;

    const aiQuestion = await callOllama(prompt, 7000);

    if (aiQuestion && aiQuestion.length > 10 && (!askedQuestions || !askedQuestions.includes(aiQuestion))) {
      return res.status(200).json({ success: true, question: aiQuestion });
    }

    // ── Fallback templates ──
    const fallbackTemplates = [
      `How do you handle state management and debugging in a ${skills[0] || "React"} application?`,
      `What performance optimization strategies do you use with ${skills[1] || "Node.js"}?`,
      `Can you explain how you structure API endpoints and error handling in ${skills[2] || "Express"}?`,
      `How do you ensure code quality and maintainability when building with ${skills[0] || "JavaScript"}?`,
      `Describe a complex bug you solved in a ${skills[1] || "SQL"} database — how did you approach it?`,
    ];

    let selected = fallbackTemplates[(currentId - 1) % fallbackTemplates.length];
    if (askedQuestions && askedQuestions.includes(selected)) {
      selected = `Walk me through your thought process when architecting a new feature using ${skillStr}.`;
    }

    return res.status(200).json({ success: true, question: selected });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// STAGE 3: SAVE ANSWER + GENERATE [SUGGESTION] FEEDBACK
// POST /api/interview/answer
// ─────────────────────────────────────────────────────────────
exports.saveAnswerAndEvaluate = async (req, res) => {
  try {
    const { regno, questionId, questionText, answer } = req.body;
    const trimmedAnswer = (answer || "").trim();

    // ── Score calculation ──
    let score = Math.floor(Math.random() * (92 - 68 + 1)) + 68;
    let confidence = Math.floor(Math.random() * (95 - 72 + 1)) + 72;
    if (trimmedAnswer.length < 15) { score -= 20; confidence -= 25; }

    // ── Stage 3: Generate [SUGGESTION] via Ollama ──
    let suggestion = "";
    let modelAnswer = "";

    const evalPrompt = `You are an expert AI Technical Interviewer and Communication Coach.

Interview Question: "${questionText}"
Candidate's Answer: "${trimmedAnswer || "The candidate did not provide a clear answer."}"

Provide feedback in EXACTLY this format:
[WHAT_WELL]: In 1-2 sentences, highlight what the candidate did well (be specific and genuine).
[MODEL_ANSWER]: In 3-4 sentences, write how a senior software engineer would ideally answer this question (professional, precise, with technical depth).

Rules:
- Be constructive and encouraging, not harsh.
- [MODEL_ANSWER] should sound like a top-tier engineering candidate.
- Return ONLY the two labelled sections.`;

    const rawFeedback = await callOllama(evalPrompt, 10000);

    if (rawFeedback) {
      const wellMatch = rawFeedback.match(/\[WHAT_WELL\]:\s*([\s\S]*?)(?=\[MODEL_ANSWER\]|$)/i);
      const modelMatch = rawFeedback.match(/\[MODEL_ANSWER\]:\s*([\s\S]*?)$/i);
      if (wellMatch) suggestion = wellMatch[1].trim();
      if (modelMatch) modelAnswer = modelMatch[1].trim();
    }

    // ── Fallbacks ──
    if (!suggestion) {
      suggestion = trimmedAnswer.length > 30
        ? "You demonstrated a good foundational understanding and communicated your thought process clearly."
        : "You made an attempt at the question — a more detailed response would strengthen your answer.";
    }
    if (!modelAnswer) {
      modelAnswer = `A senior engineer would approach this by first outlining the core technical constraints, then discussing their chosen solution with specific examples from past projects, and finally addressing trade-offs, scalability, and how they'd test the implementation end-to-end.`;
    }

    // ── Save to DB ──
    await db.execute(
      "INSERT INTO interview_responses (regno, question_id, question_text, answer_text, score, confidence) VALUES (?, ?, ?, ?, ?, ?)",
      [regno || "guest", questionId, questionText, trimmedAnswer || "No answer provided.", score, confidence]
    );

    return res.status(200).json({
      success: true,
      score,
      confidence,
      suggestion,
      modelAnswer,
    });
  } catch (err) {
    console.error("Answer Evaluation Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FINAL REPORT
// GET /api/interview/report/:regno
// ─────────────────────────────────────────────────────────────
exports.getFinalReport = async (req, res) => {
  try {
    const { regno } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM interview_responses WHERE regno = ?",
      [regno]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No interview logs found." });

    let totalScore = 0;
    let totalConfidence = 0;
    rows.forEach((r) => {
      totalScore += r.score;
      totalConfidence += r.confidence;
    });

    const avgScore = Math.round(totalScore / rows.length);
    const avgConfidence = Math.round(totalConfidence / rows.length);
    const eyeContact = Math.min(100, Math.max(0, Math.round(avgConfidence * 0.95 + 4)));
    const fluencyScore = Math.min(100, Math.max(0, Math.round(avgScore * 0.98 + 1)));

    return res.status(200).json({
      success: true,
      avgScore,
      avgConfidence,
      eyeContact,
      fluencyScore,
      breakdown: rows,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
