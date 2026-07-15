import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  FaCheckCircle,
  FaChartLine,
  FaMicrophone,
  FaUserTie,
  FaClock,
  FaEye,
  FaDownload,
  FaHistory,
} from "react-icons/fa";

import "../assets/css/report.css";

function Report() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState({
    overall: 0,
    technical: 0,
    communication: 0,
    confidence: 0,
    eye: 90,
    time: 85,
    readiness: 0,
    feedback: "No interview evaluation available.",
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await API.get("/performance");

      if (response.data.success) {
        const performance = response.data.performance;

        if (performance && performance.length > 0) {
          const last = performance[performance.length - 1];

          setResult({
            overall: Number(last.total_score) || 0,
            technical: Number(last.technical_score) || 0,
            communication: Number(last.communication_score) || 0,
            confidence: Number(last.total_score) || 0,
            eye: 90,
            time: 85,
            readiness: Number(last.total_score) || 0,
            feedback: last.feedback || "Good attempt.",
          });
        }
      }
    } catch (error) {
      console.error("Performance Error:", error);

      if (error.response?.status === 401) {
        alert("Please login again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="report-page">
        <h2 style={{ textAlign: "center", marginTop: "80px" }}>
          Loading Report...
        </h2>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>AI Interview Report</h1>
        <p>Your interview has been successfully completed.</p>
      </div>

      <div className="overall-score">
        <div className="circle">
          <h2>{result.overall}%</h2>
          <span>Overall Score</span>
        </div>
      </div>

      <div className="score-grid">
        <div className="score-card">
          <FaUserTie className="icon" />
          <h3>Technical</h3>
          <h2>{result.technical}%</h2>
        </div>

        <div className="score-card">
          <FaMicrophone className="icon" />
          <h3>Communication</h3>
          <h2>{result.communication}%</h2>
        </div>

        <div className="score-card">
          <FaCheckCircle className="icon" />
          <h3>Confidence</h3>
          <h2>{result.confidence}%</h2>
        </div>

        <div className="score-card">
          <FaEye className="icon" />
          <h3>Eye Contact</h3>
          <h2>{result.eye}%</h2>
        </div>

        <div className="score-card">
          <FaClock className="icon" />
          <h3>Time Management</h3>
          <h2>{result.time}%</h2>
        </div>

        <div className="score-card">
          <FaChartLine className="icon" />
          <h3>Placement Readiness</h3>
          <h2>{result.readiness}%</h2>
        </div>
      </div>

      <div className="feedback-card">
        <h2>AI Feedback</h2>
        <p>{result.feedback}</p>
      </div>

      <div className="action-buttons">
        <button className="download-btn" onClick={downloadReport}>
          <FaDownload /> Download Report
        </button>

        <button className="history-btn" onClick={() => navigate("/history")}>
          <FaHistory /> View History
        </button>
      </div>
    </div>
  );
}

export default Report;
