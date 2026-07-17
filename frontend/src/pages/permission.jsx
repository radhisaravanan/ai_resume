import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Permission = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [devices, setDevices] = useState({
    camera: "Pending",
    mic: "Pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestPermissions();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log(`Track ${track.kind} stopped successfully on unmount.`);
        });
      }
    };
  }, []);

  const requestPermissions = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setDevices({
        camera: "Granted",
        mic: "Granted",
      });
    } catch (error) {
      console.error("Device verification failed:", error);
      setDevices({
        camera: "Denied",
        mic: "Denied",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartWarmup = () => {
    localStorage.setItem("highest_stage", "6");

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    navigate("/interview/1");
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={previewColumnStyle}>
          <div style={videoWrapperStyle}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={videoStyle}
            />
            <span style={badgeStyle}>● LIVE WEBCAM PREVIEW</span>
          </div>
          <p style={footerTextStyle}>
            Webcam initialization successful. Position yourself centrally.
          </p>
        </div>

        <div style={controlsColumnStyle}>
          <h2 style={titleStyle}>🛡️ Stage 4: Warm-up Gate</h2>
          <p style={subtitleStyle}>
            Before we enter the official AI Interview Simulator Room, let's
            verify your local recording devices are online and streaming
            correctly.
          </p>

          <div style={matrixBoxStyle}>
            <h4 style={matrixTitleStyle}>HARDWARE CONNECTION MATRIX</h4>
            <div style={matrixRowStyle}>
              <span>📷 Camera Stream Preview:</span>
              <span
                style={
                  devices.camera === "Granted"
                    ? successTagStyle
                    : pendingTagStyle
                }
              >
                {devices.camera} {devices.camera === "Granted" && "✅"}
              </span>
            </div>
            <div style={matrixRowStyle}>
              <span>🎙️ Audio Microphone Stream:</span>
              <span
                style={
                  devices.mic === "Granted" ? successTagStyle : pendingTagStyle
                }
              >
                {devices.mic} {devices.mic === "Granted" && "✅"}
              </span>
            </div>
          </div>

          <div style={actionGroupStyle}>
            <button
              onClick={requestPermissions}
              disabled={loading}
              style={recheckButtonStyle}
            >
              🔄 Recheck & Grant Device Access
            </button>

            <button
              onClick={handleStartWarmup}
              disabled={
                devices.camera !== "Granted" || devices.mic !== "Granted"
              }
              style={{
                ...startButtonStyle,
                opacity:
                  devices.camera === "Granted" && devices.mic === "Granted"
                    ? 1
                    : 0.6,
                cursor:
                  devices.camera === "Granted" && devices.mic === "Granted"
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              Start System Warm-up Assessment 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#0f172a",
  padding: "20px",
  fontFamily: "system-ui, sans-serif",
};
const cardStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "30px",
  background: "#1e293b",
  padding: "40px",
  borderRadius: "24px",
  maxWidth: "1000px",
  width: "100%",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  alignItems: "center",
};
const previewColumnStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
const videoWrapperStyle = {
  position: "relative",
  width: "100%",
  borderRadius: "16px",
  overflow: "hidden",
  aspectRatio: "4/3",
  border: "2px solid #334155",
  background: "#000",
};
const videoStyle = { width: "100%", height: "100%", objectFit: "cover" };
const badgeStyle = {
  position: "absolute",
  top: "12px",
  left: "12px",
  backgroundColor: "#10b981",
  color: "#fff",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.5px",
};
const footerTextStyle = {
  color: "#94a3b8",
  fontSize: "13px",
  textAlign: "center",
  margin: "4px 0 0 0",
};
const controlsColumnStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};
const titleStyle = {
  color: "#fff",
  fontSize: "28px",
  fontWeight: "800",
  margin: 0,
};
const subtitleStyle = {
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: 0,
};
const matrixBoxStyle = {
  background: "#0f172a",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #334155",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};
const matrixTitleStyle = {
  color: "#cbd5e1",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "0 0 4px 0",
  textAlign: "center",
};
const matrixRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  color: "#94a3b8",
  fontSize: "14px",
  alignItems: "center",
};
const successTagStyle = { color: "#34d399", fontWeight: "700" };
const pendingTagStyle = { color: "#f87171", fontWeight: "700" };
const actionGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "10px",
};
const recheckButtonStyle = {
  padding: "12px",
  background: "transparent",
  color: "#38bdf8",
  border: "1px solid #38bdf8",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s",
};
const startButtonStyle = {
  padding: "14px",
  background: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  fontSize: "15px",
  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
};

export default Permission;
