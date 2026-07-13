import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/css/permission.css";

function Permission() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [camera, setCamera] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Start Camera & Microphone
  // ==========================

  useEffect(() => {
    startDevices();

    return () => {
      stopDevices();
    };
  }, []);

  const startDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,

        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCamera(true);

      setMicrophone(true);
    } catch (err) {
      console.log(err);

      setCamera(false);

      setMicrophone(false);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Stop Camera
  // ==========================

  const stopDevices = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());

      streamRef.current = null;
    }
  };

  // ==========================
  // Continue
  // ==========================

  const continueInterview = () => {
    stopDevices();

    navigate("/interview");
  };

  return (
    <div className="permission-page">
      <div className="permission-card">
        <h1>Camera & Microphone Permission</h1>

        <p>
          Please allow camera and microphone access before starting the
          interview.
        </p>

        <div className="video-box">
          <video ref={videoRef} autoPlay muted playsInline />
        </div>

        <div className="status">
          <h3>Camera :{camera ? " ✅ Enabled" : " ❌ Disabled"}</h3>

          <h3>Microphone :{microphone ? " ✅ Enabled" : " ❌ Disabled"}</h3>

          <h3>
            Internet :{navigator.onLine ? " ✅ Connected" : " ❌ Offline"}
          </h3>
        </div>

        <button
          className="continue-btn"
          onClick={continueInterview}
          disabled={!camera || !microphone || loading}
        >
          {loading ? "Checking..." : "Continue Interview"}
        </button>
      </div>
    </div>
  );
}

export default Permission;
