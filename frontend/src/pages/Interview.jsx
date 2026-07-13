import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../assets/css/interview.css";

function Interview() {
  const navigate = useNavigate();

  const sessionId = localStorage.getItem("sessionId");

  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(1200);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // ===============================
  // Load Question
  // ===============================
  const loadQuestion = async () => {
    try {
      const res = await API.get(`/interview/question/${sessionId}`);

      if (res.data.success) {
        setQuestion(res.data.question.question);
        setQuestionId(res.data.question.id);

        speakQuestion(res.data.question.question);
      } else {
        alert("Interview Completed");
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      alert("Unable to load question");
    }
  };

  // useEffect(() => {
  //   loadQuestion();
  // }, []);

  // ===============================
  // Timer
  // ===============================
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          alert("Interview Completed");

          navigate("/dashboard");

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ===============================
  // Text To Speech
  // ===============================
  const speakQuestion = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // ===============================
  // Initialize Speech Recognition
  // ===============================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log("Recording Started");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.log(event.error);
      alert("Speech Error : " + event.error);
    };

    recognition.onend = () => {
      console.log("Recording Stopped");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // ===============================
  // Start Recording
  // ===============================
  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition Not Available");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // Stop Recording
  // ===============================
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
  };

  // ===============================
  // Submit Answer
  // ===============================
  const submitAnswer = async () => {
    if (answer.trim() === "") {
      alert("Please answer the question.");
      return;
    }

    stopRecording();

    try {
      const res = await API.post("/interview/answer", {
        session_id: sessionId,
        question_id: questionId,
        answer,
      });

      if (res.data.success) {
        setAnswer("");

        loadQuestion();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Unable to save answer");
    }
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="interview-page">
      <div className="interview-card">
        <div className="header">
          <h2>🤖 AI Interview Assistant</h2>

          <h3>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </h3>
        </div>

        <div className="question-box">
          <h3>{question || "Loading Question..."}</h3>
        </div>

        <button className="speak-btn" onClick={() => speakQuestion(question)}>
          🔊 Listen Again
        </button>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Speak or type your answer..."
        />

        <div className="button-group">
          {!isListening ? (
            <button className="mic-btn" onClick={startRecording}>
              🎤 Start Speaking
            </button>
          ) : (
            <button className="stop-btn" onClick={stopRecording}>
              ⏹ Stop Speaking
            </button>
          )}

          <button className="submit-btn" onClick={submitAnswer}>
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default Interview;
