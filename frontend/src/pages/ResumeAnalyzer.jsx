import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [showResultCard, setShowResultCard] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a valid PDF portfolio file template.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        const extractedItems =
          data.extractedSkills && data.extractedSkills.length > 0
            ? data.extractedSkills.join(", ")
            : "NO TECHNICAL MATCHES FOUND";

        // 🎯 Safe execution prompt messaging box metrics sequence
        alert(
          `Resume evaluation matrix completed successfully!\n\nExtracted Skills Matrix from your PDF: [ ${extractedItems} ]`,
        );

        setSkills(data.extractedSkills || []);
        setLocalMessage(extractedItems);
        setShowResultCard(true);
      } else {
        alert(data.message || "Extraction failed layers context parsing.");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Extraction failed layers interface network path offline.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "520px",
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            color: "#1e293b",
            marginBottom: "10px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          📄 Step 3: Resume Skill Extraction
        </h3>
        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Upload your professional engineering profile assets here.
        </p>

        {!showResultCard ? (
          <form onSubmit={handleUploadSubmit}>
            <div
              style={{
                border: "2px dashed #cbd5e1",
                padding: "40px 20px",
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ fontSize: "14px", color: "#475569" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#64748b" : "#1e3a8a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Analyzing Context Matrix..."
                : "Upload & Analyze Skills"}
            </button>
          </form>
        ) : (
          <div>
            {/* 🎯 Real-time Data Output Container Card Block display visual */}
            <div
              style={{
                backgroundColor: "#f0fdf4",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #bbf7d0",
                textAlign: "left",
                marginBottom: "24px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  color: "#166534",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                ✅ Data Profile Analysis Complete
              </h4>
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "14px",
                  color: "#374151",
                  lineHeight: "1.5",
                }}
              >
                The core analytical engine has successfully indexed and parsed
                your parameters log variables mapping content.
              </p>

              <strong
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "#1e293b",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Extracted Target Skillsets:
              </strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#dcfce7",
                      color: "#166534",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      border: "1px solid #86efac",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action transition control routing gate block advance forward to step 4 */}
            <button
              onClick={() => navigate("/permissions")}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
              }}
            >
              Proceed to Permissions Gate ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
