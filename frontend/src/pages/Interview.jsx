import { useState, useEffect, useRef } from "react";
import "../assets/css/interview.css";

function Interview() {

  const questions = [
    "Tell me about yourself.",
    "Explain your final year project.",
    "Why do you want this job?",
    "What are your strengths?",
    "Where do you see yourself in five years?"
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(1200);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // -----------------------------
  // Countdown Timer
  // -----------------------------
  useEffect(() => {

    const timer = setInterval(() => {

      setTime((prev) => {

        if (prev > 0) return prev - 1;

        clearInterval(timer);

        alert("Interview Time Finished");

        return 0;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // -----------------------------
  // Speak Question Automatically
  // -----------------------------
  useEffect(() => {

    speakQuestion(questions[currentQuestion]);

  }, [currentQuestion]);

  // -----------------------------
  // Text To Speech
  // -----------------------------
  const speakQuestion = (text) => {

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);

  };

  // -----------------------------
  // Speech Recognition Setup
  // -----------------------------
  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert("Speech Recognition is not supported in your browser.");

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {

      setIsListening(true);

    };

    recognition.onend = () => {

      setIsListening(false);

    };

    recognition.onerror = (event) => {

      console.log(event.error);

      setIsListening(false);

    };

    recognition.onresult = (event) => {

      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        transcript += event.results[i][0].transcript;

      }

      setAnswer(transcript);

    };

    recognitionRef.current = recognition;

  }, []);

  // -----------------------------
  // Start Recording
  // -----------------------------
  const startRecording = () => {

    if (recognitionRef.current) {

      recognitionRef.current.start();

    }

  };

  // -----------------------------
  // Stop Recording
  // -----------------------------
  const stopRecording = () => {

    if (recognitionRef.current) {

      recognitionRef.current.stop();

    }

  };

  // -----------------------------
  // Submit Answer
  // -----------------------------
  const submitAnswer = () => {

    if (answer.trim() === "") {

      alert("Please answer the question.");

      return;

    }

    stopRecording();

    if (currentQuestion < questions.length - 1) {

      setCurrentQuestion(currentQuestion + 1);

      setAnswer("");

    } else {

      window.speechSynthesis.cancel();

      alert("Interview Completed Successfully!");

    }

  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (

    <div className="interview-page">

      <div className="interview-card">

        {/* Header */}

        <div className="header">

          <h2>🤖 AI Interview Assistant</h2>

          <h3>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </h3>

        </div>

        {/* Progress */}

        <div className="progress">

          <div
            className="progress-bar"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
          ></div>

        </div>

        <h4>

          Question {currentQuestion + 1} of {questions.length}

        </h4>

        {/* Question */}

        <div className="question-box">

          {questions[currentQuestion]}

        </div>

        {/* Speak Again */}

        <button
          className="speak-btn"
          onClick={() => speakQuestion(questions[currentQuestion])}
        >

          🔊 Listen Again

        </button>

        {/* Answer */}

        <textarea
          placeholder="Your voice will appear here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        {/* Microphone */}

        <div className="button-group">

          {!isListening ? (

            <button
              className="mic-btn"
              onClick={startRecording}
            >

              🎤 Start Recording

            </button>

          ) : (

            <button
              className="stop-btn"
              onClick={stopRecording}
            >

              ⏹ Stop Recording

            </button>

          )}

        </div>

        {/* Status */}

        <p className="record-status">

          {isListening
            ? "🎙 Listening..."
            : "Microphone is Off"}

        </p>

        {/* Submit */}

        <button
          className="submit-btn"
          onClick={submitAnswer}
        >

          Submit Answer

        </button>

      </div>

    </div>

  );

}

export default Interview;