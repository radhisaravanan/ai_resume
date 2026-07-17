import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState("9301");

  useEffect(() => {
    // Sync structure using global user data profile logs if present
    const storedRegno = localStorage.getItem("user_regno");
    if (storedRegno) {
      setCandidateId(storedRegno);
    }
  }, []);

  const handleStartInterviewSession = () => {
    // 1. Advance the validation safety matrix gating logic to Stage 6 (Interview Room)
    localStorage.setItem("highest_stage", "6");

    // 2. Clear out any previous question index or historical temporary interview data pools
    localStorage.setItem("current_question_index", "0");
    localStorage.setItem("interview_responses_log", JSON.stringify([]));

    // 3. Directly target dynamic execution sequence index number starting at 1
    navigate("/interview/1");
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Visual Identity Logo / Stage Icon Header */}
        <div style={iconWrapperStyle}>⚡ Step 5:</div>
        
        <h1 style={titleStyle}>Candidate Console</h1>
        <p style={welcomeStyle}>Welcome, Candidate: <strong>{candidateId}</strong></p>

        {/* Continuous Pipeline Rules Block */}
        <div style={rulesBoxStyle}>
          <h4 style={rulesTitleStyle}>📌 **Interview Rules Matrix:**</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>
              • Total of 5 Dynamic Portfolio Driven Questions matched by AI from your resume context.
            </li>
            <li style={listItemStyle}>
              • AI reads out your profile analytical feedback and question prompt directly via Speech Engine.
            </li>
            <li style={listItemStyle}>
              • Speak your answers out loud directly using the microphone capture engine for dynamic processing.
            </li>
            <li style={listItemStyle}>
              • Final evaluation matrix delivers targeted suggestions showing senior engineer model variants.
            </li>
          </ul>
        </div>

        {/* Master Execution Core Control Action Button */}
        <button 
          onClick={handleStartInterviewSession} 
          style={actionButtonStyle}
        >
          Start AI Simulator Interview Session 🚀
        </button>
      </div>
    </div>
  );
};

// ================= THEMATIC UI STYLING METRICS =================
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px", fontFamily: "system-ui, sans-serif" };
const cardStyle = { background: "#ffffff", padding: "40px 30px", borderRadius: "24px", boxShadow: "0 15px 35px rgba(0,0,0,0.06)", maxWidth: "500px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #e2e8f0" };
const iconWrapperStyle = { fontSize: "32px", fontWeight: "800", color: "#f97316", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" };
const titleStyle = { color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 6px 0", letterSpacing: "-0.5px" };
const welcomeStyle = { color: "#64748b", fontSize: "16px", margin: "0 0 24px 0" };
const rulesBoxStyle = { backgroundColor: "#eff6ff", border: "1px solid #dbeafe", padding: "24px", borderRadius: "16px", textAlign: "left", width: "100%", boxSizing: "border-box", marginBottom: "30px" };
const rulesTitleStyle = { color: "#1e40af", fontSize: "15px", fontWeight: "700", margin: "0 0 12px 0" };
const listStyle = { listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" };
const listItemStyle = { color: "#1e3a8a", fontSize: "14px", lineHeight: "1.5" };
const actionButtonStyle = { width: "100%", padding: "16px", backgroundColor: "#10b981", color: "#ffffff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)", transition: "transform 0.1s ease" };

export default Dashboard;