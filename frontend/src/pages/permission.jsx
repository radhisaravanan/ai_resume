import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Permission = () => {
  const navigate = useNavigate();
  const [camStatus, setCamStatus] = useState("Pending ⏳");
  const [micStatus, setMicStatus] = useState("Pending ⏳");
  const [warmupCheckpoint, setWarmupCheckpoint] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const requestHardwareAccess = async () => {
    try {
      setErrorMessage("");
      // Request both camera and mic access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });

      streamRef.current = stream;
      setCamStatus("Granted ✅");
      setMicStatus("Granted ✅");

      // Hook onto video element if ref is available
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => {
            console.error("Video play failed:", e);
          });
          setWarmupCheckpoint(true);
        };
      } else {
        // Fallback in case element is rendering
        setWarmupCheckpoint(true);
      }
    } catch (err) {
      console.error("Error accessing hardware:", err);
      setCamStatus("Denied ❌");
      setMicStatus("Denied ❌");
      setWarmupCheckpoint(false);
      setErrorMessage(
        "Hardware access request failed. Please check browser permissions and try again."
      );
    }
  };

  // Attempt to auto-initialize on mount for best UX
  useEffect(() => {
    requestHardwareAccess();

    // Cleanup: Stop all media stream tracks on unmount to release hardware locks
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log(`Track ${track.kind} stopped successfully.`);
        });
      }
    };
  }, []);

  // Extra helper to reconnect stream to video ref if it renders late or changes
  useEffect(() => {
    if (streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.error(e));
    }
  }, [warmupCheckpoint]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f172a", // Sleek dark mode background
        color: "#f8fafc",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "1100px",
          backgroundColor: "#1e293b", // Slate-800 card container
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          overflow: "hidden",
          border: "1px solid #334155",
        }}
      >
        {/* Left/Top Panel: Webcam Stream Area */}
        <div
          style={{
            flex: "1 1 500px",
            backgroundColor: "#020617", // Deeper dark for camera window
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            minHeight: "400px",
            padding: "20px",
            boxSizing: "border-box",
            borderRight: "1px solid #334155",
          }}
        >
          {warmupCheckpoint ? (
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                backgroundColor: "#10b981",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  animation: "pulse 1.5s infinite",
                }}
              />
              LIVE WEBCAM PREVIEW
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                backgroundColor: "#f59e0b",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
              }}
            >
              AWAITING ACCESS
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "450px",
              borderRadius: "16px",
              objectFit: "cover",
              backgroundColor: "#1e293b",
              border: "2px solid #334155",
              transform: "scaleX(-1)", // Mirror effect for natural preview
            }}
          />

          <p
            style={{
              marginTop: "16px",
              color: "#94a3b8",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            {warmupCheckpoint
              ? "Webcam initialization successful. Position yourself centrally."
              : "Checking system camera and microphone device streams..."}
          </p>
        </div>

        {/* Right/Bottom Panel: Info and Actions */}
        <div
          style={{
            flex: "1 1 450px",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: "#38bdf8", // Premium light blue accent
              margin: "0 0 12px 0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            🛡️ Stage 4: Warm-up Gate
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "15px",
              lineHeight: "1.6",
              margin: "0 0 24px 0",
            }}
          >
            Before we enter the official AI Interview Simulator Room, let's verify
            your local recording devices are online and streaming correctly.
          </p>

          {/* Status Matrix */}
          <div
            style={{
              backgroundColor: "#0f172a",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #334155",
              marginBottom: "24px",
            }}
          >
            <h4
              style={{
                margin: "0 0 14px 0",
                fontSize: "14px",
                color: "#cbd5e1",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Hardware Connection Matrix
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #1e293b",
              }}
            >
              <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                🎥 Camera Stream Preview:
              </span>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>
                {camStatus}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
              }}
            >
              <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                🎙️ Audio Microphone Stream:
              </span>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>
                {micStatus}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          <button
            onClick={requestHardwareAccess}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "transparent",
              color: "#38bdf8",
              border: "2px solid #38bdf8",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              marginBottom: "16px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            🔄 Recheck & Grant Device Access
          </button>

          {warmupCheckpoint ? (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#10b981", // Emerald primary button
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#059669";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#10b981";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start System Warm-up Assessment 🚀
            </button>
          ) : (
            <button
              disabled
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#475569",
                color: "#94a3b8",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "not-allowed",
              }}
            >
              Awaiting Warm-up Checkpoint...
            </button>
          )}
        </div>
      </div>

      {/* Embedded keyframe animation styles inside component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
      `}} />
    </div>
  );
};

export default Permission;
