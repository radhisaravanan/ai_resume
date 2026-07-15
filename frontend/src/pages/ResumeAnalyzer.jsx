import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaFilePdf,
  FaUpload,
  FaCheckCircle,
  FaChartPie,
  FaBrain,
  FaArrowRight,
} from "react-icons/fa";
import API from "../services/api";
import "../assets/css/resumeAnalyzer.css";

function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload your resume.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      // Sends the real file to your backend route
      const response = await API.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.success) {
        setResult(response.data.analysis);
        localStorage.setItem("resume_filename", file.name);
        localStorage.setItem(
          "resume_analysis",
          JSON.stringify(response.data.analysis),
        );
      } else {
        alert(
          "Analysis failed: " +
            (response.data?.message || "Invalid response format."),
        );
      }
    } catch (error) {
      console.error("Resume Upload Error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to connect to the backend server. Make sure your server is running on port 5000.",
      );
    } finally {
      setLoading(false);
    }
  };

  const continueSetup = () => {
    navigate("/setup");
  };

  return (
    <div className="resume-page">
      <div className="resume-card">
        <h1>
          <FaBrain />
          AI Resume Analyzer
        </h1>
        <p>Upload your resume and get AI feedback instantly.</p>

        <div className="upload-box">
          <FaFilePdf className="pdf-icon" />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {file && <p>Selected Resume : {file.name}</p>}

        <button
          type="button"
          className="analyze-btn"
          onClick={analyzeResume}
          disabled={loading}
        >
          <FaUpload />
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {result && (
          <>
            <div className="score-section">
              <div className="score-card">
                <FaChartPie />
                <h2>{result.ats || 85}%</h2>
                <p>ATS Score</p>
              </div>

              <div className="score-card">
                <FaCheckCircle />
                <h2>{result.match || 90}%</h2>
                <p>Resume Match</p>
              </div>
            </div>

            <div className="skills">
              <h2>Extracted Skills</h2>
              {(result.skills || []).map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>

            <div className="suggestions">
              <h2>AI Suggestions</h2>
              <ul>
                {(result.suggestions || []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="start-button"
              onClick={continueSetup}
              style={{ cursor: "pointer" }}
            >
              Continue To Setup
              <FaArrowRight />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
