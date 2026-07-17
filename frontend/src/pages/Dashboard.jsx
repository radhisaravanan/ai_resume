import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import "../assets/css/dashboard.css";

import {
  FaPlay,
  FaHistory,
  FaChartLine,
  FaFileAlt,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState("9301");
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Student",
  };

  useEffect(() => {
    const storedRegno = localStorage.getItem("user_regno");
    if (storedRegno) {
      setCandidateId(storedRegno);
    }
  }, []);

  const startInterview = () => {
    navigate("/interviewsetup");
  };

  const openResume = () => {
    navigate("/resume");
  };

  const openReports = () => {
    navigate("/report");
  };

  const openHistory = () => {
    navigate("/history");
  };

  const handleStartInterviewSession = () => {
    localStorage.setItem("highest_stage", "6");
    localStorage.setItem("current_question_index", "0");
    localStorage.setItem("interview_responses_log", JSON.stringify([]));
    navigate("/interview/1");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`dashboard-page ${collapsed ? "collapsed" : ""}`}>
        <div className="stats-container">
          <div className="stat-card total-card">
            <div className="stat-icon">
              <FaHistory />
            </div>
            <div>
              <h2>25</h2>
              <p>Total Interviews</p>
            </div>
          </div>

          <div className="stat-card average-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div>
              <h2>89%</h2>
              <p>Average Score</p>
            </div>
          </div>

          <div className="stat-card resume-card">
            <div className="stat-icon">
              <FaFileAlt />
            </div>
            <div>
              <h2>85%</h2>
              <p>Resume Score</p>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <h2>Welcome back, {user.name}</h2>
          <button className="start-btn" onClick={startInterview}>
            <FaPlay />
            Start AI Interview
          </button>
        </div>

        <div className="quick-section">
          <h2>Quick Access</h2>
          <div className="quick-access">
            <div className="quick-card interview-card" onClick={startInterview}>
              <div className="circle-icon">
                <FaPlay />
              </div>
              <h3>AI Interview</h3>
            </div>

            <div className="quick-card resume-btn" onClick={openResume}>
              <div className="circle-icon">
                <FaFileAlt />
              </div>
              <h3>Resume</h3>
            </div>

            <div className="quick-card report-btn" onClick={openReports}>
              <div className="circle-icon">
                <FaChartLine />
              </div>
              <h3>Reports</h3>
            </div>

            <div className="quick-card history-btn" onClick={openHistory}>
              <div className="circle-icon">
                <FaHistory />
              </div>
              <h3>History</h3>
            </div>
          </div>
        </div>

        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={iconWrapperStyle}>⚡ Step 5:</div>
            <h1 style={titleStyle}>Candidate Console</h1>
            <p style={welcomeStyle}>
              Welcome, Candidate: <strong>{candidateId}</strong>
            </p>

            <div style={rulesBoxStyle}>
              <h4 style={rulesTitleStyle}>📌 Interview Rules Matrix:</h4>
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

            <button onClick={handleStartInterviewSession} style={actionButtonStyle}>
              Start AI Simulator Interview Session 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  padding: "20px",
  fontFamily: "system-ui, sans-serif",
};
const cardStyle = {
  background: "#ffffff",
  padding: "40px 30px",
  borderRadius: "24px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
  maxWidth: "500px",
  width: "100%",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: "1px solid #e2e8f0",
};
const iconWrapperStyle = {
  fontSize: "32px",
  fontWeight: "800",
  color: "#f97316",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};
const titleStyle = {
  color: "#0f172a",
  fontSize: "36px",
  fontWeight: "800",
  margin: "0 0 6px 0",
  letterSpacing: "-0.5px",
};
const welcomeStyle = {
  color: "#64748b",
  fontSize: "16px",
  margin: "0 0 24px 0",
};
const rulesBoxStyle = {
  backgroundColor: "#eff6ff",
  border: "1px solid #dbeafe",
  padding: "24px",
  borderRadius: "16px",
  textAlign: "left",
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "30px",
};
const rulesTitleStyle = {
  color: "#1e40af",
  fontSize: "15px",
  fontWeight: "700",
  margin: "0 0 12px 0",
};
const listStyle = {
  listStyleType: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const listItemStyle = {
  color: "#1e3a8a",
  fontSize: "14px",
  lineHeight: "1.5",
};
const actionButtonStyle = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#10b981",
  color: "#ffffff",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
  transition: "transform 0.1s ease",
};

export default Dashboard;


