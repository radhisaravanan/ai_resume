import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InterviewRoom = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  
  const currentIdx = parseInt(questionId || "1", 10) - 1;
  const totalQuestions = 5;

  // Local state tracking core parameter metrics
  const [aiStatus, setAiStatus] = useState("AI is preparing feedback...");
  const [motivationText, setMotivationText] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userTranscript, setUserTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);

  // References for handling speech operations safely
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  // Simulated backend mock database logic mapping resume analytics variables 
  // (In real implementation, these strings match your backend LLM system output blocks)
  const mockAiPipelineData = [
    {
      motivation: "Your experience with React and state architecture looks incredibly solid. You have built great interface parameters!",
      question: "Can you explain how the Virtual DOM works in React and how it optimizes UI updates?"
    },
    {
      motivation: "Impressive database schema design history. Parameter handling across indices shows clean execution logic.",
      question: "What is the difference between SQL indexing and normal sequential scan, and when should you use it?"
    },
    {
      motivation: "Your Node.js async loop handles demonstrate high performance structure mapping layouts.",
      question: "How does the Node.js event loop work, and what happens when an async operation finishes?"
    },
    {
      motivation: "RESTful architecture microservices flow tracking shows great production standard patterns.",
      question: "What are the common HTTP status codes used in API development and what do they signify?"
    },
    {
      motivation: "Solid cybersecurity practices visible across payload token tracking layers.",
      question: "How does JWT structure signatures securely prevent token tampering in client-side storage?"
    }
  ];

  useEffect(() => {
    // 1. Initialize Browser Speech Recognition configurations
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setUserTranscript((prev) => prev + (prev ? " " : "") + transcript);
      };

      rec.onerror = (err) => console.error("Speech Recognition Engine Error:", err);
      rec.onend = () => setIsRecording(false);
      
      recognitionRef.current = rec;
    }

    // 2. Trigger AI Automated Speaking Routine on Route Activation
    executeAiVoiceRoutine();

    // Clean up synthesizers on route changing stages
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [questionId]);

  const executeAiVoiceRoutine = () => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel(); // Stop ongoing talk configurations immediately

    const currentStageData = mockAiPipelineData[currentIdx] || mockAiPipelineData[0];
    
    setMotivationText(currentStageData.motivation);
    setCurrentQuestion(currentStageData.question);
    setUserTranscript(""); // Clear user text response text layer for new sequence
    setAiStatus("📢 AI is speaking...");

    // Phrase synthesis concatenation text lines
    const fullSpeechText = `Hello Candidate. First, an automated feedback on your profile: ${currentStageData.motivation}. Now, listen carefully to Question number ${currentIdx + 1}: ${currentStageData.question}`;

    const utterance = new SpeechSynthesisUtterance(fullSpeechText);
    utterance.lang = "en-US";
    utterance.rate = 0.95; // Steady conversational pacing structure

    utterance.onend = () => {
      setAiStatus("🎙️ AI is listening. Press 'Start Capture Microphone' and answer.");
    };

    synthesisRef.current.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Browser speech processing framework not supported on this device.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setUserTranscript(""); // Reset before capture
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleNextOrSubmit = () => {
    if (!userTranscript.trim()) {
      alert("Please provide a verbal response or type your answer before proceeding.");
      return;
    }

    setLoadingNext(true);

    // Save user response structures into active memory buffer lists
    const currentResponses = JSON.parse(localStorage.getItem("interview_responses_log") || "[]");
    currentResponses.push({
      questionNumber: currentIdx + 1,
      questionText: currentQuestion,
      candidateResponse: userTranscript
    });
    localStorage.setItem("interview_responses_log", JSON.stringify(currentResponses));

    if (currentIdx < totalQuestions - 1) {
      // Advance routes linearly
      setLoadingNext(false);
      navigate(`/interview/${currentIdx + 2}`);
    } else {
      // Last step hit! Unlock final report stage gate metrics smoothly
      localStorage.setItem("highest_stage", "7");
      setLoadingNext(false);
      navigate("/report");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Progress Tracker Layer */}
        <div style={headerStyle}>
          <span style={stageBadgeStyle}>Question {currentIdx + 1} of {totalQuestions}</span>
          <div style={statusBarStyle}>{aiStatus}</div>
        </div>

        {/* AI Output Display Boxes */}
        <div style={aiBlockWrapperStyle}>
          <div style={motivationBoxStyle}>
            <span style={labelStyle}>✨ AI PROFILE MOTIVATION FEEDBACK:</span>
            <p style={textStyle}>{motivationText || "Processing profile metrics text layers..."}</p>
          </div>

          <div style={questionBoxStyle}>
            <span style={labelStyle}>❓ TARGET TECHNICAL QUESTION:</span>
            <h3 style={questionTitleStyle}>{currentQuestion || "Formulating interactive inquiry..."}</h3>
          </div>
        </div>

        {/* Live Speech Capturing Box Interface */}
        <div style={transcriptWrapperStyle}>
          <span style={labelStyle}>🎙️ YOUR CAPTURED TEXT TRANSCRIPT:</span>
          <textarea
            value={userTranscript}
            onChange={(e) => setUserTranscript(e.target.value)}
            placeholder="Your spoken words will append automatically here as text raw data segments..."
            style={textAreaStyle}
          />
        </div>

        {/* Interactive Action Control Core Triggers */}
        <div style={controlsRowStyle}>
          <button
            onClick={toggleRecording}
            style={{
              ...micButtonStyle,
              backgroundColor: isRecording ? "#ef4444" : "#2563eb",
            }}
          >
            {isRecording ? "⏹️ Stop Capture Mic" : "🎙️ Start Capture Microphone"}
          </button>

          <button
            onClick={handleNextOrSubmit}
            disabled={loadingNext}
            style={nextButtonStyle}
          >
            {currentIdx < totalQuestions - 1 ? "Next AI Question ➡️" : "Submit Interview for Review 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= ARCHITECTURAL PRESENTATION UI LAYOUTS =================
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f172a", padding: "20px", fontFamily: "system-ui, sans-serif" };
const cardStyle = { background: "#1e293b", borderRadius: "24px", padding: "40px", maxWidth: "800px", width: "100%", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", gap: "24px", border: "1px solid #334155" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "16px" };
const stageBadgeStyle = { backgroundColor: "#f97316", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" };
const statusBarStyle = { color: "#38bdf8", fontSize: "14px", fontWeight: "600" };
const aiBlockWrapperStyle = { display: "flex", flexDirection: "column", gap: "16px" };
const motivationBoxStyle = { backgroundColor: "rgba(249, 115, 22, 0.08)", border: "1px dashed rgba(249, 115, 22, 0.3)", padding: "20px", borderRadius: "14px" };
const questionBoxStyle = { backgroundColor: "#0f172a", border: "1px solid #334155", padding: "24px", borderRadius: "16px" };
const labelStyle = { display: "block", fontSize: "11px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1px", marginBottom: "6px" };
const textStyle = { color: "#cbd5e1", fontSize: "14px", margin: 0, lineHeight: "1.5" };
const questionTitleStyle = { color: "#ffffff", fontSize: "18px", fontWeight: "700", margin: 0, lineHeight: "1.5" };
const transcriptWrapperStyle = { display: "flex", flexDirection: "column", gap: "8px" };
const textAreaStyle = { width: "100%", height: "120px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", padding: "14px", color: "#fff", fontSize: "14px", resize: "none", boxSizing: "border-box", lineHeight: "1.5" };
const controlsRowStyle = { display: "flex", justifyContent: "space-between", gap: "16px", marginTop: "10px" };
const micButtonStyle = { padding: "14px 24px", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "background 0.2s" };
const nextButtonStyle = { padding: "14px 28px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)" };

export default InterviewRoom;