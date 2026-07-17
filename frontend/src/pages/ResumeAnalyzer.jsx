import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ResumeAnalyzer = ({ compact, onResumeValidated, onCancel }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [flashMessage, setFlashMessage] = useState("");

  const clearResumeCache = () => {
    localStorage.removeItem("resume_context");
    localStorage.removeItem("interview_responses_log");
    localStorage.removeItem("resume_questions_log");
    localStorage.removeItem("interview_questions");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMsg("");
    setFlashMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Please select a valid PDF file first.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const { data } = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.isValidResume) {
        const generatedQuestions = data.generatedInterviewQuestions || [];
        setQuestions(generatedQuestions);
        setAnalysisComplete(true);
        setFlashMessage("");
        setErrorMsg("");

        localStorage.setItem(
          "resume_context",
          JSON.stringify({
            questions: generatedQuestions,
            summary: "Resume validated and interview questions generated.",
          }),
        );
        localStorage.setItem(
          "resume_questions_log",
          JSON.stringify(generatedQuestions),
        );
        localStorage.setItem(
          "interview_questions",
          JSON.stringify(generatedQuestions),
        );
      } else {
        setQuestions([]);
        setAnalysisComplete(false);
        setFile(null);
        clearResumeCache();
        setErrorMsg("This is not a resume");
        setFlashMessage("This is not a resume");
        window.setTimeout(() => setFlashMessage(""), 2200);
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || error.message || "File upload failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPermissions = () => {
    if (onResumeValidated) {
      onResumeValidated(questions);
    } else {
      localStorage.setItem("highest_stage", "4");
      navigate("/permissions");
    }
  };

  return (
    <div style={compact ? { width: "100%" } : containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>📄 Step 3: Resume Skill Extraction</h2>
        <p style={subtitleStyle}>
          Upload your professional engineering profile assets here.
        </p>

        {errorMsg && <div style={errorStyle}>{errorMsg}</div>}

        {flashMessage && (
          <div style={flashModalStyle}>
            <div style={flashCardStyle}>
              <h3 style={{ margin: "0 0 8px", color: "#b91c1c" }}>
                Validation Alert
              </h3>
              <p style={{ margin: 0, color: "#7f1d1d" }}>
                This is not a resume
              </p>
            </div>
          </div>
        )}

        {!analysisComplete ? (
          <form onSubmit={handleUpload} style={formStyle}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={fileInputStyle}
              required
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Processing Assets..." : "Upload & Analyze PDF"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{ ...buttonStyle, backgroundColor: "#64748b" }}
              >
                Cancel
              </button>
            )}
          </form>
        ) : (
          <div style={resultWrapperStyle}>
            <div style={alertSuccessStyle}>
              <h5
                style={{
                  color: "#065f46",
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                }}
              >
                ✅ Data Profile Analysis Complete
              </h5>
              <p
                style={{
                  color: "#047857",
                  margin: "0 0 16px 0",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                The core analytical engine has successfully indexed and parsed
                your parameters log variables mapping content.
              </p>

              <label style={tagLabelStyle}>
                GENERATED INTERVIEW QUESTIONS:
              </label>
              <div style={chipContainerStyle}>
                {questions.map((item) => (
                  <div key={item.questionNumber} style={questionCardStyle}>
                    <strong>
                      {item.questionNumber}. {item.targetSkillOrProject}
                    </strong>
                    <div style={{ marginTop: "6px", color: "#334155" }}>
                      {item.questionText}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleProceedToPermissions}
              style={proceedButtonStyle}
            >
              Proceed to Permissions Gate ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f0f4f8",
  padding: "20px",
};
const cardStyle = {
  background: "#ffffff",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  maxWidth: "560px",
  width: "100%",
  textAlign: "center",
};
const titleStyle = {
  color: "#1e293b",
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "8px",
};
const subtitleStyle = {
  color: "#64748b",
  fontSize: "14px",
  marginBottom: "24px",
};
const errorStyle = {
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "16px",
  fontSize: "14px",
};
const formStyle = { display: "flex", flexDirection: "column", gap: "16px" };
const fileInputStyle = {
  padding: "12px",
  border: "2px dashed #cbd5e1",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
  boxSizing: "border-box",
};
const buttonStyle = {
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};
const resultWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};
const alertSuccessStyle = {
  backgroundColor: "#ecfdf5",
  border: "1px solid #a7f3d0",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "left",
};
const tagLabelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: "#065f46",
  marginBottom: "8px",
  letterSpacing: "0.5px",
};
const chipContainerStyle = { display: "flex", flexWrap: "wrap", gap: "8px" };
const questionCardStyle = {
  backgroundColor: "#f8fafc",
  border: "1px solid #cbd5e1",
  padding: "12px",
  borderRadius: "10px",
  width: "100%",
  boxSizing: "border-box",
  textAlign: "left",
};
const flashModalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(2, 6, 23, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const flashCardStyle = {
  background: "#fff1f2",
  border: "1px solid #fda4af",
  padding: "24px 28px",
  borderRadius: "16px",
  boxShadow: "0 16px 40px rgba(2, 6, 23, 0.2)",
  textAlign: "center",
  maxWidth: "320px",
};
const proceedButtonStyle = {
  padding: "14px",
  backgroundColor: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "15px",
  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
};

export default ResumeAnalyzer;
