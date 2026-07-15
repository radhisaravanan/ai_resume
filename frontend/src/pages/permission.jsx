import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaMicrophone,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

function Permission() {
  const navigate = useNavigate();
  const [hasCamera, setHasCamera] = useState(false);
  const [hasMic, setHasMic] = useState(false);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (stream) {
        setHasCamera(true);
        setHasMic(true);
        stream.getTracks().forEach((track) => track.stop()); // Stop immediately after validating
      }
    } catch (err) {
      console.error("Hardware permission failure: ", err);
      alert(
        "Hardware Blocked: Please allow access to camera and microphone to start the AI Voice Interview.",
      );
    }
  };

  const handleNext = () => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      navigate(`/interview/${sessionId}`);
    } else {
      navigate("/interview");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>
          Hardware Access Required
        </h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          The AI interviewer needs access to your camera and microphone to track
          responses and analyze engagement.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "30px",
          }}
        >
          <div>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: hasCamera ? "#dcfce7" : "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 8px",
                color: hasCamera ? "#16a34a" : "#666",
              }}
            >
              <FaCamera size={24} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Camera</span>
          </div>
          <div>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: hasMic ? "#dcfce7" : "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 8px",
                color: hasMic ? "#16a34a" : "#666",
              }}
            >
              <FaMicrophone size={24} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              Microphone
            </span>
          </div>
        </div>

        {!hasCamera || !hasMic ? (
          <button
            onClick={requestPermissions}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Allow Device Access
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <FaCheckCircle /> Enter Interview Room <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}

export default Permission;
