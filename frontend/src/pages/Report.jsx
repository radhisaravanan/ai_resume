import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaChartLine,
  FaMicrophone,
  FaUserTie,
  FaClock,
  FaEye,
  FaDownload,
  FaHistory
} from "react-icons/fa";
import "../assets/css/report.css";

function Report() {

  const navigate = useNavigate();

  const result = {

    overall: 88,
    technical: 90,
    communication: 85,
    confidence: 87,
    eye: 91,
    time: 84,
    readiness: 89

  };

  return (

    <div className="report-page">

      <div className="report-header">

        <h1>AI Interview Report</h1>

        <p>
          Your interview has been successfully completed.
        </p>

      </div>

      <div className="overall-score">

        <div className="circle">

          <h2>{result.overall}%</h2>

          <span>Overall Score</span>

        </div>

      </div>

      <div className="score-grid">

        <div className="score-card">
          <FaUserTie className="icon"/>
          <h3>Technical</h3>
          <h2>{result.technical}%</h2>
        </div>

        <div className="score-card">
          <FaMicrophone className="icon"/>
          <h3>Communication</h3>
          <h2>{result.communication}%</h2>
        </div>

        <div className="score-card">
          <FaCheckCircle className="icon"/>
          <h3>Confidence</h3>
          <h2>{result.confidence}%</h2>
        </div>

        <div className="score-card">
          <FaEye className="icon"/>
          <h3>Eye Contact</h3>
          <h2>{result.eye}%</h2>
        </div>

        <div className="score-card">
          <FaClock className="icon"/>
          <h3>Time Management</h3>
          <h2>{result.time}%</h2>
        </div>

        <div className="score-card">
          <FaChartLine className="icon"/>
          <h3>Placement Readiness</h3>
          <h2>{result.readiness}%</h2>
        </div>

      </div>

      <div className="feedback-card">

        <h2>AI Suggestions</h2>

        <ul>

          <li>✔ Excellent technical knowledge.</li>

          <li>✔ Improve communication fluency.</li>

          <li>✔ Maintain eye contact during answers.</li>

          <li>✔ Give more structured responses.</li>

          <li>✔ Reduce pauses while speaking.</li>

        </ul>

      </div>

      <div className="action-buttons">

        <button className="download-btn">

          <FaDownload />

          Download Report

        </button>

        <button
          className="history-btn"
          onClick={() => navigate("/history")}
        >

          <FaHistory />

          View History

        </button>

      </div>

    </div>

  );

}

export default Report;