
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import "../assets/css/dashboard.css";

import {
  FaPlay,
  FaHistory,
  FaChartLine,
  FaFileAlt,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  /* ===========================
     Sidebar Collapse State
  =========================== */
  const [collapsed, setCollapsed] = useState(false);

  /* ===========================
     Logged-in User
  =========================== */
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Student",
  };

  /* ===========================
     Navigation
  =========================== */

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

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Dashboard */}
      <div
        className={`dashboard-page ${
          collapsed ? "collapsed" : ""
        }`}
      >

        {/* ===========================
            Statistics
        ============================ */}

        <div className="stats-container">

          {/* Total Interviews */}

          <div className="stat-card total-card">

            <div className="stat-icon">
              <FaHistory />
            </div>

            <div>

              <h2>25</h2>

              <p>Total Interviews</p>

            </div>

          </div>

          {/* Average Score */}

          <div className="stat-card average-card">

            <div className="stat-icon">
              <FaChartLine />
            </div>

            <div>

              <h2>89%</h2>

              <p>Average Score</p>

            </div>

          </div>

          {/* Resume Score */}

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

        {/* ===========================
            Welcome Card
        ============================ */}

        <div className="hero-card">

          <button
            className="start-btn"
            onClick={startInterview}
          >
            <FaPlay />
            Start AI Interview
          </button>

        </div>

        {/* ===========================
            Quick Access
        ============================ */}

        <div className="quick-section">

          <h2>Quick Access</h2>

          <div className="quick-access">

            {/* Interview */}

            <div
              className="quick-card interview-card"
              onClick={startInterview}
            >

              <div className="circle-icon">
                <FaPlay />
              </div>

              <h3>AI Interview</h3>

            </div>

            {/* Resume */}

            <div
              className="quick-card resume-btn"
              onClick={openResume}
            >

              <div className="circle-icon">
                <FaFileAlt />
              </div>

              <h3>Resume</h3>

            </div>

            {/* Reports */}

            <div
              className="quick-card report-btn"
              onClick={openReports}
            >

              <div className="circle-icon">
                <FaChartLine />
              </div>

              <h3>Reports</h3>

            </div>

            {/* History */}

            <div
              className="quick-card history-btn"
              onClick={openHistory}
            >

              <div className="circle-icon">
                <FaHistory />
              </div>

              <h3>History</h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;


