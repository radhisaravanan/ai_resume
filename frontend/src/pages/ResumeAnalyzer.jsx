import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);

    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("❌ Invalid format. Only PDF files are allowed.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/analyze-resume",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        // Safe key storage allocation for InterviewRoom utility
        localStorage.setItem("resumeText", data.extractedText);

        setSummary({
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          characterCount: data.extractedText.length,
          status: "Successfully Parsed & Dynamic Questions Prepared!",
        });
      } else {
        setError(data.error || "Failed to analyze the resume.");
      }
    } catch (err) {
      setError("Could not connect to the backend parsing server.");
    } finally {
      setAnalyzing(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "650px",
      margin: "80px auto",
      padding: "40px",
      backgroundColor: "#ffffff",
      borderRadius: "24px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      fontFamily: "'Inter', sans-serif",
    },
    title: {
      fontSize: "24px",
      fontWeight: "800",
      color: "#0f172a",
      margin: "0 0 10px 0",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "14px",
      color: "#64748b",
      textAlign: "center",
      marginBottom: "30px",
    },
    dropzone: {
      border: "2px dashed #cbd5e1",
      borderRadius: "16px",
      padding: "30px",
      textAlign: "center",
      backgroundColor: "#f8fafc",
      cursor: "pointer",
      display: "block",
    },
    btn: {
      width: "100%",
      padding: "14px",
      fontSize: "16px",
      fontWeight: "700",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      marginTop: "20px",
    },
    summaryCard: {
      marginTop: "25px",
      padding: "20px",
      backgroundColor: "#f1f5f9",
      borderRadius: "14px",
      borderLeft: "4px solid #10b981",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>AI Resume Analyzer</h2>
      <p style={styles.subtitle}>
        Upload your PDF profile before starting the interview session layout.
      </p>

      <form onSubmit={handleUpload}>
        <label style={styles.dropzone} htmlFor="resumeFile">
          <input
            id="resumeFile"
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📄</div>
          <span
            style={{ fontWeight: "600", color: "#334155", display: "block" }}
          >
            {file ? file.name : "Click to select your PDF resume"}
          </span>
        </label>

        {error && (
          <p
            style={{
              color: "#dc2626",
              textAlign: "center",
              marginTop: "15px",
              fontWeight: "600",
            }}
          >
            {error}
          </p>
        )}

        {!summary && (
          <button
            type="submit"
            disabled={analyzing || !file}
            style={{
              ...styles.btn,
              backgroundColor: !file ? "#94a3b8" : "#2563eb",
            }}
          >
            {analyzing ? "Analyzing Document Layer..." : "Analyze Profile 🔎"}
          </button>
        )}
      </form>

      {summary && (
        <div style={styles.summaryCard}>
          <h4 style={{ margin: "0 0 12px 0", fontWeight: "800" }}>
            ✅ Analysis Complete
          </h4>
          <p style={{ fontSize: "14px", margin: "4px 0" }}>
            <strong>File:</strong> {summary.fileName}
          </p>
          <p style={{ fontSize: "14px", margin: "4px 0" }}>
            <strong>Tokens Found:</strong> {summary.characterCount} characters
          </p>

          <button
            onClick={() => navigate("/interview/1")}
            style={{ ...styles.btn, backgroundColor: "#10b981" }}
          >
            Start Custom Interview Room ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
