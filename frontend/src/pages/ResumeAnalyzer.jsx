import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(["GENERAL TECHNICAL METRICS"]);
  const [analysisComplete, setAnalysisComplete] = useState(false); // Shows upload form by default
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMsg("");
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

      if (data.success) {
        const extractedSkills = data.skills || ["GENERAL TECHNICAL METRICS"];
        const summaryText = data.summary || "Parsed profile parameter log details.";
        
        setSkills(extractedSkills);
        setAnalysisComplete(true);

        // CRUCIAL STAGE LOCK BRIDGE FOR INTERVIEW ROOM
        localStorage.setItem(
          "resume_context",
          JSON.stringify({ skills: extractedSkills, summary: summaryText })
        );
      } else {
        setErrorMsg(data.message || "Failed to parse the uploaded profile asset.");
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || error.message || "File upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // HANDLER FOR THE INTERFACE BUTTON SHOWN IN YOUR SCREENSHOT
  const handleProceedToPermissions = () => {
    // 1. UPDATE STAGE TRACKER TO STAGE 4 (PERMISSIONS) SECURELY BEFORE REDIRECTING
    localStorage.setItem("highest_stage", "4");

    // 2. NOW TRANSLATE SAFELY WITHOUT HIT BLOCKS BY STAGEGUARD
    navigate("/permissions");
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>📄 Step 3: Resume Skill Extraction</h2>
        <p style={subtitleStyle}>Upload your professional engineering profile assets here.</p>

        {errorMsg && <div style={errorStyle}>{errorMsg}</div>}

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
          </form>
        ) : (
          <div style={resultWrapperStyle}>
            <div style={alertSuccessStyle}>
              <h5 style={{ color: "#065f46", margin: "0 0 8px 0", fontWeight: "600" }}>
                ✅ Data Profile Analysis Complete
              </h5>
              <p style={{ color: "#047857", margin: "0 0 16px 0", fontSize: "14px", lineHeight: "1.5" }}>
                The core analytical engine has successfully indexed and parsed your parameters log variables mapping content.
              </p>
              
              <label style={tagLabelStyle}>EXTRACTED TARGET SKILLSETS:</label>
              <div style={chipContainerStyle}>
                {skills.map((skill, index) => (
                  <span key={index} style={chipStyle}>{skill}</span>
                ))}
              </div>
            </div>

            {/* CRUCIAL CONTROL BUTTON ATTACHED TO SAFE DISPATCH ACTION ROUTINE */}
            <button onClick={handleProceedToPermissions} style={proceedButtonStyle}>
              Proceed to Permissions Gate ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= LAYOUT METRICS ARCHITECTURAL STYLES =================
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f4f8", padding: "20px" };
const cardStyle = { background: "#ffffff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", maxWidth: "560px", width: "100%", textAlign: "center" };
const titleStyle = { color: "#1e293b", fontSize: "22px", fontWeight: "700", marginBottom: "8px" };
const subtitleStyle = { color: "#64748b", fontSize: "14px", marginBottom: "24px" };
const errorStyle = { backgroundColor: "#fef2f2", color: "#b91c1c", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "16px" };
const fileInputStyle = { padding: "12px", border: "2px dashed #cbd5e1", borderRadius: "8px", cursor: "pointer", width: "100%", boxSizing: "border-box" };
const buttonStyle = { padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const resultWrapperStyle = { display: "flex", flexDirection: "column", gap: "20px" };
const alertSuccessStyle = { backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", padding: "20px", borderRadius: "12px", textAlign: "left" };
const tagLabelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#065f46", marginBottom: "8px", letterSpacing: "0.5px" };
const chipContainerStyle = { display: "flex", flexWrap: "wrap", gap: "8px" };
const chipStyle = { backgroundColor: "#d1fae5", color: "#065f46", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", border: "1px solid #86efac", letterSpacing: "0.5px" };
const proceedButtonStyle = { padding: "14px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)" };

export default ResumeAnalyzer;