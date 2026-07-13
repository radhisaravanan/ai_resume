import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaStop, FaVideo, FaClock } from "react-icons/fa";

import API from "../services/api";

import "../assets/css/interviewRoom.css";
function InterviewRoom() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const sessionId = localStorage.getItem("sessionId");

  const [question, setQuestion] = useState(null);

  const [questionId, setQuestionId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

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

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [uploading, setUploading] = useState(false);
  /* ==========================
      START CAMERA
  ========================== */

 useEffect(() => {
   startCamera();
   loadQuestion();
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
  const loadQuestion = async () => {
    try {
      const response = await API.get(`/interview/question/${sessionId}`);

      if (response.data.completed) {
        navigate("/report");
        return;
      }

      if (response.data.success) {
        setQuestion(response.data.question.question);
        setQuestionId(response.data.question.id);

        setTranscript("");
        setTimer(60);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to load question");
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
    // Start Audio Recording

    audioChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(streamRef.current);

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.start();

    mediaRecorderRef.current = mediaRecorder;

    recognitionRef.current = recognition;
  };;

  const stopListening = async () => {
    // Stop Speech Recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    setListening(false);

    // Stop Audio Recording
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();

        formData.append("audio", audioBlob, "answer.webm");

        formData.append("user_id", JSON.parse(localStorage.getItem("user")).id);

        formData.append("question_id", currentQuestion + 1);

        try {
          setUploading(true);

          const response = await API.post("/voice/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log(response.data);

          if (response.data.success) {
            // Replace browser transcript with Whisper transcript
            setTranscript(response.data.answer);

            // Save answer_id for evaluation later
            localStorage.setItem("answer_id", response.data.answer_id);
          }
        } catch (err) {
          console.log(err);

          alert("Audio upload failed");
        }

        setUploading(false);
      };
    }
  };
  /* ==========================
      NEXT QUESTION
  ========================== */

 const nextQuestion = async () => {
   stopListening();

   const answerId = localStorage.getItem("answer_id");

   if (answerId) {
     try {
       const response = await API.post("/evaluation/check", {
         answer_id: answerId,
       });

       console.log("Evaluation:", response.data);

       localStorage.setItem(
         "lastEvaluation",
         JSON.stringify(response.data.evaluation),
       );
     } catch (err) {
       console.log(err);

       alert("Evaluation failed");
     }
   }

   if (currentQuestion < questions.length - 1) {
     setCurrentQuestion((prev) => prev + 1);

     setTranscript("");

     setTimer(60);

     localStorage.removeItem("answer_id");
   } else {
     stopCamera();

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
              <span className="camera-on">🟢 Camera on radhii</span>
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
          <h2>Question {currentQuestion + 1} of 5</h2>

          <p>{question}</p>
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
          {uploading ? (
            <span className="recording">⏳ Uploading Answer...</span>
          ) : listening ? (
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
