import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/permission.css";

function Permission() {

  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [camera, setCamera] = useState(false);
  const [microphone, setMicrophone] = useState(false);

  useEffect(() => {

    async function startCamera() {

      try {

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        videoRef.current.srcObject = stream;

        setCamera(true);
        setMicrophone(true);

      } catch (error) {

        setCamera(false);
        setMicrophone(false);

      }

    }

    startCamera();

  }, []);

  return (

    <div className="permission-page">

      <div className="permission-card">

        <h1>Camera & Microphone Permission</h1>

        <p>Please allow access before starting the interview.</p>

        <div className="video-box">

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />

        </div>

        <div className="status">

          <h3>
            Camera :
            {camera ? " ✅ Enabled" : " ❌ Disabled"}
          </h3>

          <h3>
            Microphone :
            {microphone ? " ✅ Enabled" : " ❌ Disabled"}
          </h3>

          <h3>
            Internet :
            {navigator.onLine ? " ✅ Connected" : " ❌ Offline"}
          </h3>

        </div>

        <button
          onClick={() => navigate("/interview")}
          className="continue-btn"
        >
          Continue Interview
        </button>

      </div>

    </div>

  );

}

export default Permission;