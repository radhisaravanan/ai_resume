import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // 2. Initialize the hook

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStartInterview = async (e) => {
    e.preventDefault(); // Prevent default browser form refresh

    if (!file) {
      alert("Please choose a resume file before starting the interview.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // 3. Post file to backend
      const response = await fetch("http://localhost:5000/api/resumes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if you use auth
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Resume uploaded successfully!");
        // 4. REDIRECT THE USER TO THE INTERVIEW ROOM
        navigate("/interview");
      } else {
        alert(data.message || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(
        "Something went wrong connecting to the server. Moving to interview room with fallback options.",
      );
      // Fallback routing even if backend upload has an issue so your flow doesn't freeze
      navigate("/interview");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "100px auto",
        padding: "30px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        textAlign: "center",
        fontFamily: "system-ui",
      }}
    >
      <h2>📄 Upload Your Resume</h2>
      <p style={{ color: "#6b7280" }}>
        We will customize your technical questions based on your background.
      </p>

      <form onSubmit={handleStartInterview}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ margin: "20px 0", display: "block", width: "100%" }}
        />
        <button
          type="submit"
          disabled={uploading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Processing Resume..." : "🚀 Start Interview"}
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;
