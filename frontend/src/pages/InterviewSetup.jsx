import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaRobot,
  FaSpinner,
} from "react-icons/fa";
import API from "../services/api";

function InterviewSetup() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file.");
      setFile(null);
    }
  };

  const handleAnalyzeAndStart = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your resume first!");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // 1. Upload & analyze resume
      const response = await API.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const { detectedRole, skills, sessionId } = response.data;

        // 2. Save session details locally for the Interview Room to read
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("detectedRole", detectedRole);
        localStorage.setItem("parsedSkills", JSON.stringify(skills));

        // 3. Cleanly move to the Permission step as originally intended
        navigate("/permission");
      } else {
        setError(response.data.message || "Failed to analyze resume.");
      }
    } catch (err) {
      console.error("Resume processing failed:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while analyzing your resume.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f7fc",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "25px" }}>
          <h2
            style={{
              color: "#d91b23", // Matches the deep crimson color scheme
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            <FaRobot /> Interview Configuration
          </h2>
          <p
            style={{
              color: "#666",
              marginTop: "10px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            Upload your resume below. Our AI will analyze your experience and
            generate a targeted set of interview questions.
          </p>
        </div>

        {error && (
          <div
            style={{
              color: "#d91b23",
              backgroundColor: "#ffebe6",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleAnalyzeAndStart}>
          <div style={{ marginBottom: "25px" }}>
            <label
              htmlFor="resume-upload"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #cbd5e1",
                padding: "35px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#f8fafc",
                transition: "border-color 0.2s",
              }}
            >
              <FaCloudUploadAlt
                size={46}
                style={{ color: "#94a3b8", marginBottom: "12px" }}
              />
              {file ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#334155",
                    fontWeight: "600",
                  }}
                >
                  <FaFilePdf style={{ color: "#d91b23" }} />
                  <span>{file.name}</span>
                </div>
              ) : (
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  <span style={{ fontWeight: "600", color: "#2563eb" }}>
                    Click to select your PDF resume
                  </span>
                  <br />
                  <small
                    style={{
                      color: "#94a3b8",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    Only PDF format is accepted
                  </small>
                </div>
              )}
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#2563eb", // Elegant blue button
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading || !file ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              opacity: loading || !file ? 0.7 : 1,
            }}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <FaSpinner
                  className="fa-spin"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Analyzing Resume...
              </>
            ) : (
              "Continue to Permissions"
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default InterviewSetup;
