import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/css/dashboard.css";

import {
  FaPlay,
  FaHistory,
  FaChartLine,
  FaRobot,
  FaFileAlt,
  FaGoogle,
  FaAmazon,
  FaMicrosoft,
  FaUserGraduate,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa";

import { SiZoho } from "react-icons/si";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);
      const response = await API.post("/interview/start");

      if (response.data.success) {
        localStorage.setItem("sessionId", response.data.sessionId);
        navigate("/setup");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        {/* ================= HERO ================= */}
        <div className="hero-card">
          <div className="hero-left">
            <span className="hero-badge">🤖 AI MOCK INTERVIEW</span>
            <h1>
              Welcome, <span> {user?.full_name || "Student"}</span> 👋
            </h1>
            <p>
              Improve your interview skills with AI-powered mock interviews,
              resume analysis, coding rounds, aptitude practice, and detailed
              reports.
            </p>
            <div className="hero-buttons">
              <button
                className="start-btn"
                onClick={startInterview}
                disabled={loading}
              >
                <FaPlay />
                {loading ? "Initializing..." : "Start Interview"}
              </button>
              <button
                className="outline-btn"
                onClick={() => navigate("/reports")}
              >
                View Reports
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-circle">
              <h2>92%</h2>
              <span>
                Placement
                <br />
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* ================= STATISTICS ================= */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon pink">
              <FaHistory />
            </div>
            <div>
              <h2>25</h2>
              <p>Total Interviews</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <FaChartLine />
            </div>
            <div>
              <h2>89%</h2>
              <p>Average Score</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <FaRobot />
            </div>
            <div>
              <h2>92%</h2>
              <p>AI Readiness</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FaFileAlt />
            </div>
            <div>
              <h2>85%</h2>
              <p>Resume Score</p>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="main-grid">
          {/* ================= UPCOMING INTERVIEW ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Upcoming Interview</h2>
              <FaArrowRight />
            </div>
            <div className="interview-box">
              <div className="interview-top">
                <div>
                  <h3>Frontend Developer</h3>
                  <span className="company-name">Google</span>
                </div>
                <div className="status-badge">Scheduled</div>
              </div>
              <div className="interview-details">
                <div className="detail-item">
                  <span>Difficulty</span>
                  <strong>Medium</strong>
                </div>
                <div className="detail-item">
                  <span>Duration</span>
                  <strong>20 Minutes</strong>
                </div>
                <div className="detail-item">
                  <span>Questions</span>
                  <strong>10</strong>
                </div>
              </div>
              <button className="small-btn" onClick={startInterview}>
                <FaPlay /> Start Interview
              </button>
            </div>
          </div>

          {/* ================= RESUME STATUS ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Resume Status</h2>
              <FaFileAlt />
            </div>
            <div className="resume-box">
              <div className="resume-score">
                <h1>85%</h1>
              </div>
              <h3>Resume Uploaded</h3>
              <p>ATS Score : 85%</p>
              <p>Last Updated : Today</p>
              <button className="small-btn" onClick={() => navigate("/resume")}>
                Update Resume
              </button>
            </div>
          </div>

          {/* ================= AI SUGGESTIONS ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>AI Suggestions</h2>
              <FaLightbulb />
            </div>
            <ul className="suggestion-list">
              <li>✔ Improve React Hooks</li>
              <li>✔ Practice JavaScript ES6</li>
              <li>✔ Revise DBMS Concepts</li>
              <li>✔ Improve Communication</li>
              <li>✔ Solve Aptitude Questions</li>
              <li>✔ Practice HR Interview</li>
            </ul>
          </div>

          {/* ================= RECENT INTERVIEWS ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Recent Interviews</h2>
              <FaUserGraduate />
            </div>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Google</td>
                  <td>Frontend Developer</td>
                  <td>90%</td>
                </tr>
                <tr>
                  <td>Amazon</td>
                  <td>React Developer</td>
                  <td>88%</td>
                </tr>
                <tr>
                  <td>Infosys</td>
                  <td>Java Developer</td>
                  <td>92%</td>
                </tr>
                <tr>
                  <td>TCS</td>
                  <td>Node.js Developer</td>
                  <td>86%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ================= PERFORMANCE PROGRESS ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Performance Progress</h2>
              <FaChartLine />
            </div>
            <div className="progress-section">
              <div className="progress-item">
                <div className="progress-title">
                  <span>Technical Skills</span>
                  <span>90%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill technical"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-title">
                  <span>Communication</span>
                  <span>82%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill communication"
                    style={{ width: "82%" }}
                  ></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-title">
                  <span>Problem Solving</span>
                  <span>88%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill problem"
                    style={{ width: "88%" }}
                  ></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-title">
                  <span>Confidence</span>
                  <span>85%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill confidence"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PLACEMENT READINESS ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Placement Readiness</h2>
              <FaRobot />
            </div>
            <div className="placement-section">
              <div className="placement-circle">
                <h1>92%</h1>
              </div>
              <h3>Excellent Progress 🚀</h3>
              <p>
                Your AI performance indicates you are ready for most campus
                placement interviews. (ai model included)
              </p>
            </div>
          </div>

          {/* ================= TOP PLACEMENT COMPANIES ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Top Placement Companies</h2>
              <FaGoogle />
            </div>
            <div className="company-grid">
              <div className="company-item">
                <FaGoogle />
                <span>Google</span>
              </div>
              <div className="company-item">
                <FaMicrosoft />
                <span>Microsoft</span>
              </div>
              <div className="company-item">
                <FaAmazon />
                <span>Amazon</span>
              </div>
              <div className="company-item">
                <SiZoho />
                <span>Zoho</span>
              </div>
              <div className="company-item">
                <FaRobot />
                <span>Infosys</span>
              </div>
              <div className="company-item">
                <FaChartLine />
                <span>TCS</span>
              </div>
              <div className="company-item">
                <FaRobot />
                <span>Wipro</span>
              </div>
              <div className="company-item">
                <FaChartLine />
                <span>Cognizant</span>
              </div>
            </div>
          </div>

          {/* ================= LEADERBOARD ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Leaderboard</h2>
              <FaHistory />
            </div>
            <table className="leaderboard-table">
              <tbody>
                <tr>
                  <td>🥇 Rahul</td>
                  <td>98%</td>
                </tr>
                <tr>
                  <td>🥈 Priya</td>
                  <td>95%</td>
                </tr>
                <tr>
                  <td>🥉 {user?.full_name || "You"}</td>
                  <td>92%</td>
                </tr>
                <tr>
                  <td>4️⃣ Arjun</td>
                  <td>90%</td>
                </tr>
                <tr>
                  <td>5️⃣ Divya</td>
                  <td>89%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ================= TODAY'S CHALLENGE ================= */}
          <div className="dashboard-card challenge-card">
            <div className="card-header">
              <h2>Today's Challenge</h2>
              <FaRobot />
            </div>
            <div className="challenge-content">
              <h3>Explain the Virtual DOM in React.</h3>
              <p>
                Attempt today's interview challenge to improve your technical
                interview score.
              </p>
              <button className="start-btn" onClick={startInterview}>
                <FaPlay /> Practice Now
              </button>
            </div>
          </div>

          {/* ================= UPCOMING PLACEMENT DRIVES ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Upcoming Placement Drives</h2>
              <FaArrowRight />
            </div>
            <div className="drive-list">
              <div className="drive-item">
                <div>
                  <h4>Google</h4>
                  <span>Frontend Developer</span>
                </div>
                <p>20 July</p>
              </div>
              <div className="drive-item">
                <div>
                  <h4>Microsoft</h4>
                  <span>Software Engineer</span>
                </div>
                <p>23 July</p>
              </div>
              <div className="drive-item">
                <div>
                  <h4>Amazon</h4>
                  <span>SDE Intern</span>
                </div>
                <p>28 July</p>
              </div>
              <div className="drive-item">
                <div>
                  <h4>Zoho</h4>
                  <span>Full Stack Developer</span>
                </div>
                <p>30 July</p>
              </div>
            </div>
          </div>

          {/* ================= QUICK ACTIONS ================= */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
              <FaLightbulb />
            </div>
            <div className="quick-actions">
              <button className="action-btn" onClick={startInterview}>
                🎤 Start Mock Interview
              </button>
              <button
                className="action-btn"
                onClick={() => navigate("/resume")}
              >
                📄 Upload Resume
              </button>
              <button
                className="action-btn"
                onClick={() => navigate("/reports")}
              >
                📊 View Reports
              </button>
              <button
                className="action-btn"
                onClick={() => navigate("/history")}
              >
                📜 Interview History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
