import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMicrophone,
  FaStop,
  FaVideo,
  FaClock,
} from "react-icons/fa";
import "../assets/css/interviewRoom.css";

function InterviewRoom() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  const questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "Explain React Hooks.",
    "Where do you see yourself in five years?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [timer, setTimer] = useState(60);
  const [listening, setListening] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  /* ==========================
      START CAMERA
  ========================== */

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
    } catch (err) {
      console.log(err);
      alert("Camera permission denied.");
    }
  };

  /* ==========================
      STOP CAMERA
  ========================== */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  /* ==========================
        TIMER
  ========================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          nextQuestion();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion]);
  /* ==========================
      SPEECH RECOGNITION
  ========================== */

  const startListening = () => {
    if (listening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += text + " ";
        } else {
          interimTranscript += text;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.log(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();

    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    setListening(false);
  };
  /* ==========================
      NEXT QUESTION
  ========================== */

  const nextQuestion = () => {
    stopListening();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTranscript("");
      setTimer(60);
    } else {
      stopListening();
      stopCamera();

      alert("Interview Completed!");

      navigate("/report");
    }
  };

  /* ==========================
      CLEANUP
  ========================== */

  useEffect(() => {
    return () => {
      stopListening();
      stopCamera();
    };
  }, []);
  return (
    <div className="interview-page">
      {/* Left Panel */}
      <div className="left-panel">
        <h2>
          <FaVideo /> Live Camera
        </h2>

        <div className="camera-box">
          <video ref={videoRef} autoPlay playsInline muted />

          <div className="camera-status">
            {cameraOn ? (
              <span className="camera-on">🟢 Camera ON</span>
            ) : (
              <span className="camera-off">🔴 Camera OFF</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <h1>AI Interview</h1>

        <div className="timer">
          <FaClock /> {timer}s
        </div>

        <div className="question-box">
          <h2>
            Question {currentQuestion + 1} of {questions.length}
          </h2>

          <p>{questions[currentQuestion]}</p>
        </div>

        <div className="answer-box">
          <h3>Your Answer</h3>

          <textarea
            value={transcript}
            placeholder="Your spoken answer will appear here..."
            readOnly
          />
        </div>

        <div className="status-box">
          {listening ? (
            <span className="recording">🔴 Recording...</span>
          ) : (
            <span className="not-recording">🎤 Microphone Ready</span>
          )}
        </div>

        <div className="buttons">
          <button
            className={`mic-btn ${listening ? "active" : ""}`}
            onClick={startListening}
            disabled={listening}
            title="Start Recording"
          >
            <FaMicrophone />
          </button>

          <button
            className="stop-btn"
            onClick={stopListening}
            disabled={!listening}
            title="Stop Recording"
          >
            <FaStop />
          </button>

          <button className="next-btn" onClick={nextQuestion}>
            {currentQuestion === questions.length - 1
              ? "Finish Interview"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewRoom;