import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ResumeAnalyzer from "./ResumeAnalyzer";
import "../assets/css/dashboard.css";

// தேவையான அனைத்து Icons-ஐயும் Import செய்கிறோம்
import { FaPlay, FaHistory, FaChartLine, FaFileAlt, FaHome } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [candidateId, setCandidateId] = useState("9301");
  const [collapsed, setCollapsed] = useState(false);

  // 🔄 Active Panel State: 'home' | 'resume' | 'warmup' | 'console' | 'reports' | 'history'
  const [activePanel, setActivePanel] = useState("home");
  const [resumeQuestions, setResumeQuestions] = useState([]);
  const [streamActive, setStreamActive] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Student",
  };

  useEffect(() => {
    const storedRegno = localStorage.getItem("user_regno");
    if (storedRegno) {
      setCandidateId(storedRegno);
    }
    
    // Cache-ல் ஏற்கனவே கேள்விகள் இருந்தால் அதை State-க்கு ஏற்றுகிறோம்
    const cachedQuestions = localStorage.getItem("interview_questions");
    if (cachedQuestions) {
      try {
        setResumeQuestions(JSON.parse(cachedQuestions));
      } catch (e) {
        console.error("Error parsing cached questions", e);
      }
    }
  }, []);

  // 📷 Hardware Stream Handler (Stage 4)
  const initHardwareStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      } else {
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.error("Camera or microphone permission denied:", err);
      setStreamActive(false);
    }
  };

  // 🧹 Camera Cleanup Mechanism
  useEffect(() => {
    let timerId = null;

    if (activePanel === "warmup") {
      timerId = setTimeout(() => {
        initHardwareStream();
      }, 150);
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setStreamActive(false);
      }
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activePanel]);

  // =============== FUNCTIONAL TRIGGERS FOR ICONS & CARDS ===============
  const openHome = () => setActivePanel("home");
  
  const startInterview = () => {
    setActivePanel("resume"); // Stage 3-க்கு கூட்டிச் செல்லும்
    localStorage.setItem("highest_stage", "3");
  };

  const openResume = () => {
    setActivePanel("resume");
    localStorage.setItem("highest_stage", "3");
  };

  const openReports = () => {
    setActivePanel("reports"); // Reports பேனலைத் திறக்கும்
  };

  const openHistory = () => {
    setActivePanel("history"); // History பேனலைத் திறக்கும்
  };

  const handleResumeValidated = (questions) => {
    setResumeQuestions(questions || []);
    setActivePanel("warmup");
    localStorage.setItem("highest_stage", "4");
  };

  const handleProceedToConsole = () => {
    setActivePanel("console");
    localStorage.setItem("highest_stage", "5");
  };

  const handleStartInterviewSession = () => {
    localStorage.setItem("highest_stage", "6");
    localStorage.setItem("current_question_index", "0");
    localStorage.setItem("interview_responses_log", JSON.stringify([]));
    navigate("/interview/1");
  };

  return (
    <div className="dashboard-layout" style={{ minHeight: "100vh", backgroundColor: "#0b1329" }}>
      
      {/* 🔴 SIDEBAR INTEGRATION: இதனுள் இருக்கும் ஆன்-கிளிக் ஃபங்க்ஷன்களும் வேலை செய்யும் */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        onHomeClick={openHome}
        onInterviewClick={startInterview}
        onResumeClick={openResume}
        onReportsClick={openReports}
        onHistoryClick={openHistory}
        activePanel={activePanel}
      />

      <div className={`dashboard-page ${collapsed ? "collapsed" : ""}`}>
        
        {/* ================= 🏠 HOME PANEL ================= */}
        {activePanel === "home" && (
          <>
            {/* Top Stat Summary Cards */}
            <div className="stats-container">
              <div className="stat-card total-card" onClick={openHistory} style={{ cursor: "pointer" }}>
                <div className="stat-icon"><FaHistory /></div>
                <div>
                  <h2>25</h2>
                  <p>Total Interviews</p>
                </div>
              </div>
              <div className="stat-card average-card" onClick={openReports} style={{ cursor: "pointer" }}>
                <div className="stat-icon"><FaChartLine /></div>
                <div>
                  <h2>89%</h2>
                  <p>Average Score</p>
                </div>
              </div>
              <div className="stat-card resume-card" onClick={openResume} style={{ cursor: "pointer" }}>
                <div className="stat-icon"><FaFileAlt /></div>
                <div>
                  <h2>85%</h2>
                  <p>Resume Score</p>
                </div>
              </div>
            </div>

            {/* Main Welcome Hero Box */}
            <div className="hero-card">
              <h2>Welcome back, {user.name}</h2>
              <p>Ready to level up your technical expertise? Let's start a session.</p>
              <button className="start-btn" onClick={startInterview}>
                <FaPlay /> Start AI Interview
              </button>
            </div>

            {/* 🎯 QUICK ACCESS MATRIX - ALL TOUCH ACTIONS HOOKED UP */}
            <div className="quick-section">
              <h2>Quick Access</h2>
              <div className="quick-access">
                <div className="quick-card interview-card" onClick={startInterview}>
                  <div className="circle-icon"><FaPlay /></div>
                  <h3>AI Interview</h3>
                </div>
                <div className="quick-card resume-btn" onClick={openResume}>
                  <div className="circle-icon"><FaFileAlt /></div>
                  <h3>Resume Analyzer</h3>
                </div>
                <div className="quick-card report-btn" onClick={openReports}>
                  <div className="circle-icon"><FaChartLine /></div>
                  <h3>Performance Reports</h3>
                </div>
                <div className="quick-card history-btn" onClick={openHistory}>
                  <div className="circle-icon"><FaHistory /></div>
                  <h3>Interview History</h3>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= 📑 OTHER PANELS (WIZARD FLOW & FEATURES) ================= */}
        {activePanel !== "home" && (
          <div style={focusedWizardWrapperStyle}>
            <button onClick={openHome} style={backToDashboardButtonStyle}>
              ⬅ Back to Home Dashboard
            </button>

            {/* 📄 STAGE 3: RESUME ANALYZER PANEL */}
            {activePanel === "resume" && (
              <div style={cardPlacementConstraintStyle}>
                <ResumeAnalyzer
                  compact={true}
                  onResumeValidated={handleResumeValidated}
                  onCancel={openHome}
                />
              </div>
            )}

            {/* 🛡️ STAGE 4: HARDWARE CONNECTION GATE */}
            {activePanel === "warmup" && (
              <div style={darkStageFourCardWrapperStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "28px", width: "100%" }}>
                  <div style={{ flex: 1, minWidth: "290px" }}>
                    <div style={{ position: "relative", backgroundColor: "#1e293b", borderRadius: "16px", overflow: "hidden", height: "260px", border: "2px solid #334155" }}>
                      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: streamActive ? "#10b981" : "#ef4444", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "5px 10px", borderRadius: "20px" }}>
                        {streamActive ? "• LIVE WEBCAM ACTIVE" : "• INITIALIZING MEDIA"}
                      </span>
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: "290px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", margin: "0 0 8px 0" }}>🛡️ Stage 4: Warm-up Gate</h3>
                      <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", margin: "0 0 24px 0" }}>
                        Verify your local recording devices are online and streaming correctly.
                      </p>

                      <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid #334155" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#e2e8f0" }}>
                          <span>📷 Camera Stream Preview:</span>
                          <span style={{ color: streamActive ? "#10b981" : "#ef4444", fontWeight: "700" }}>
                            {streamActive ? "Granted ✓" : "Permission Denied ❌"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
                      <button onClick={initHardwareStream} style={{ width: "100%", padding: "14px", backgroundColor: "transparent", color: "#38bdf8", border: "1px solid #38bdf8", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
                        🔄 Recheck & Grant Device Access
                      </button>
                      <button onClick={handleProceedToConsole} style={greenSimulatorActionButtonStyle}>
                        Start System Warm-up Assessment 🚀
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ⚡ STAGE 5: CANDIDATE CONSOLE PANEL */}
            {activePanel === "console" && (
              <div style={cleanStepFiveCardWrapperStyle}>
                <div style={iconWrapperStyle}>⚡ Step 5:</div>
                <h1 style={{ ...titleStyle, color: "#0f172a" }}>Candidate Console</h1>
                <p style={welcomeStyle}>Welcome, Candidate: <strong>{candidateId}</strong></p>

                <div style={rulesBoxStyle}>
                  <h4 style={rulesTitleStyle}>📌 System Rules Matrix:</h4>
                  <ul style={listStyle}>
                    <li style={listItemStyle}>• Phase 1 strict validation constraints applied.</li>
                    <li style={listItemStyle}>• Total of 5 unique architectural questions matched by resume context.</li>
                  </ul>
                </div>

                <button onClick={handleStartInterviewSession} style={actionButtonStyle}>
                  Start AI Simulator Interview Session 🚀
                </button>
              </div>
            )}

            {/* 📊 FEATURE PANEL: PERFORMANCE REPORTS */}
            {activePanel === "reports" && (
              <div style={featurePanelStyle}>
                <div style={{ fontSize: "40px" }}><FaChartLine style={{ color: "#38bdf8" }} /></div>
                <h2 style={{ color: "#fff", margin: "10px 0" }}>Performance Metrics Analytics</h2>
                <p style={{ color: "#94a3b8", maxWidth: "500px", margin: "0 auto 20px" }}>
                  Detailed graphs, core evaluation vectors, and critical speech metrics analytics report templates will generate here post session execution.
                </p>
                <div style={mockDataBoxStyle}>📊 Deep AI Scoring Engine Dashboard Core Active. No reports generated yet.</div>
              </div>
            )}

            {/* ⏳ FEATURE PANEL: INTERVIEW HISTORY */}
            {activePanel === "history" && (
              <div style={featurePanelStyle}>
                <div style={{ fontSize: "40px" }}><FaHistory style={{ color: "#a855f7" }} /></div>
                <h2 style={{ color: "#fff", margin: "10px 0" }}>Interview History Logs</h2>
                <p style={{ color: "#94a3b8", maxWidth: "500px", margin: "0 auto 20px" }}>
                  Review your previously logged structural mock sessions, feedback metrics, and structural code reviews.
                </p>
                <table style={historyTableStyle}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #334155", color: "#cbd5e1" }}>
                      <th style={{ padding: "10px", textAlign: "left" }}>Session Date</th>
                      <th style={{ padding: "10px", textAlign: "left" }}>Role Domain</th>
                      <th style={{ padding: "10px", textAlign: "right" }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #1e293b", color: "#94a3b8" }}>
                      <td style={{ padding: "12px 10px" }}>2026-06-12</td>
                      <td style={{ padding: "12px 10px" }}>Fullstack Developer</td>
                      <td style={{ padding: "12px 10px", textAlign: "right", color: "#10b981", fontWeight: "700" }}>91%</td>
                    </tr>
                    <tr style={{ color: "#94a3b8" }}>
                      <td style={{ padding: "12px 10px" }}>2026-05-28</td>
                      <td style={{ padding: "12px 10px" }}>React Architecture Specialist</td>
                      <td style={{ padding: "12px 10px", textAlign: "right", color: "#34d399", fontWeight: "700" }}>87%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

// ================= STYLING DESIGN METRICS =================
const focusedWizardWrapperStyle = { width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px", minHeight: "85vh", boxSizing: "border-box", zIndex: 100, position: "relative" };
const backToDashboardButtonStyle = { alignSelf: "flex-start", backgroundColor: "#1e293b", border: "1px solid #334155", color: "#94a3b8", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", marginBottom: "24px" };
const cardPlacementConstraintStyle = { width: "100%", maxWidth: "540px", display: "flex", justifyContent: "center" };
const darkStageFourCardWrapperStyle = { background: "#0f172a", padding: "36px", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", maxWidth: "840px", width: "100%", border: "1px solid #1e293b", boxSizing: "border-box" };
const cleanStepFiveCardWrapperStyle = { background: "#ffffff", padding: "40px 32px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)", maxWidth: "540px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #e2e8f0", boxSizing: "border-box" };
const iconWrapperStyle = { fontSize: "28px", fontWeight: "800", color: "#f97316", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" };
const titleStyle = { fontSize: "32px", fontWeight: "800", margin: "0 0 6px 0", letterSpacing: "-0.5px" };
const welcomeStyle = { color: "#64748b", fontSize: "14px", margin: "0 0 24px 0" };
const rulesBoxStyle = { backgroundColor: "#eff6ff", border: "1px solid #dbeafe", padding: "20px", borderRadius: "16px", textAlign: "left", width: "100%", boxSizing: "border-box", marginBottom: "24px" };
const rulesTitleStyle = { color: "#1e40af", fontSize: "14px", fontWeight: "700", margin: "0 0 10px 0" };
const listStyle = { listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" };
const listItemStyle = { color: "#1e3a8a", fontSize: "13px", lineHeight: "1.6" };
const greenSimulatorActionButtonStyle = { width: "100%", padding: "16px", backgroundColor: "#10b981", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer" };
const actionButtonStyle = { width: "100%", padding: "16px", backgroundColor: "#10b981", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer" };

// New Feature Panel UI Blocks
const featurePanelStyle = { background: "#1e293b", border: "1px solid #334155", borderRadius: "24px", padding: "40px", width: "100%", maxWidth: "700px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" };
const mockDataBoxStyle = { background: "#0f172a", border: "1px dashed #475569", padding: "20px", borderRadius: "12px", color: "#64748b", fontSize: "14px", marginTop: "10px" };
const historyTableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" };

export default Dashboard;