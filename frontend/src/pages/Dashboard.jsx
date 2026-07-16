import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const regno = localStorage.getItem("regno") || "STUDENT";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "50px",
          borderRadius: "24px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.05)",
          textAlign: "center",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h1 style={{ color: "#0f172a", margin: "0 0 10px 0" }}>
          ⚡ Step 5: Candidate Console
        </h1>
        <p style={{ color: "#64748b", fontWeight: "600" }}>
          Welcome, Candidate: {regno}
        </p>
        <div
          style={{
            padding: "24px",
            backgroundColor: "#eff6ff",
            borderRadius: "16px",
            color: "#1e40af",
            fontSize: "14px",
            margin: "24px 0",
            lineHeight: "1.5",
            textAlign: "left",
          }}
        >
          📌 **Interview Rules Matrix:**
          <br />
          • Total of 5 Dynamic Portfolio Driven Questions.
          <br />
          • Speak your answers out loud directly using the microphone capture
          engine.
          <br />• Review and edit structural typed layers before final
          submissions.
        </div>
        <button
          onClick={() => navigate("/interview/1")}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
          }}
        >
          Start AI Simulator Interview Session 🚀
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
