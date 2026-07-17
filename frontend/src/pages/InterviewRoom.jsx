import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InterviewRoom = () => {
  const { questionId: rawQuestionId } = useParams();
  const navigate = useNavigate();

  // Route parameters secure calculation validation check
  const questionId = parseInt(rawQuestionId) || 1;

  // Core States
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Hardware Elements Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Safe Parameter Normalization Route Guard
  useEffect(() => {
    if (
      !rawQuestionId ||
      rawQuestionId === "undefined" ||
      isNaN(parseInt(rawQuestionId))
    ) {
      console.log(
        "⚠️ URL parameter tracking invalid string context. Redirecting safely to /interview/1",
      );
      navigate("/interview/1", { replace: true });
    }
  }, [rawQuestionId, navigate]);

  // 1. Setup Camera Monitor Preview
  useEffect(() => {
    const enableWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera could not be initialized:", err);
      }
    };

    enableWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [questionId]);

  // 2. Setup Robust Voice-to-Text Speech Recognition Engine (Candidate Input)
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true; // Flashes text live as you speak
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentSpeech = finalTranscript + interimTranscript;
        if (currentSpeech.trim().length > 0) {
          setAnswer(currentSpeech);
        }
      };

      rec.onerror = (err) => {
        console.error("❌ Speech API Error:", err.error);
        if (err.error === "not-allowed") {
          alert(
            "Microphone access is blocked! Check your browser address bar permissions icon.",
          );
        }
        setIsListening(false);
      };

      rec.onend = () => {
        console.log("Speech engine session paused.");
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [questionId]);

  // 3. Load Dynamic Question Setup + Automatically Speak the Question Out Loud
  useEffect(() => {
    if (!rawQuestionId || rawQuestionId === "undefined") return;

    const loadQuestionData = async () => {
      setLoading(true);
      setError(null);

      const resumeText = localStorage.getItem("resumeText") || "";

      try {
        const response = await fetch(
          "http://localhost:5000/api/interview/question",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questionId: questionId,
              resumeText: resumeText,
            }),
          },
        );

        const data = await response.json();
        if (data.success) {
          setQuestion(data.question);

          // 📢 TEXT-TO-SPEECH (TTS) SYSTEM TRIGGER
          window.speechSynthesis.cancel();

          const utterance = new SpeechSynthesisUtterance(data.question);
          utterance.lang = "en-US";
          utterance.rate = 0.95; // Professional, clear interviewer pace
          utterance.pitch = 1.0;

          const voices = window.speechSynthesis.getVoices();
          const selectedVoice =
            voices.find(
              (voice) =>
                voice.lang.includes("en-US") && voice.name.includes("Google"),
            ) || voices[0];
          if (selectedVoice) utterance.voice = selectedVoice;

          window.speechSynthesis.speak(utterance);
        } else {
          setError(data.error || "Failed to load the interview question.");
        }
      } catch (err) {
        setError("Could not connect to the interview server.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestionData();
  }, [questionId, rawQuestionId]);

  // Handle Speech Transcription Button Toggle
  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not fully configured or supported in this browser. Try Chrome.",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Stop narration if it's still running when the user starts speaking
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }

        setIsListening(true);
        recognitionRef.current.start();
      } catch (micErr) {
        console.error("Microphone hardware setup block:", micErr);
        alert(
          "Microphone permission denied. Enable browser system recording access.",
        );
      }
    }
  };

  // Submit Answer Action
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    window.speechSynthesis.cancel();

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/answer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: questionId,
            answer: answer,
          }),
        },
      );

      const data = await response.json();
      if (data.success) {
        setAnswer("");
        const nextId = questionId + 1;
        if (nextId <= 5) {
          navigate(`/interview/${nextId}`);
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.error || "Failed to submit your answer.");
      }
    } catch (err) {
      setError("Failed to submit answer. Check server connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    layout: {
      display: "flex",
      gap: "30px",
      maxWidth: "1150px",
      margin: "50px auto",
      padding: "0 20px",
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    leftPane: {
      flex: "1",
      maxWidth: "320px",
    },
    proctorCard: {
      backgroundColor: "#111827",
      padding: "20px",
      borderRadius: "24px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      textAlign: "center",
      boxSizing: "border-box",
    },
    proctorTitle: {
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "800",
      letterSpacing: "0.8px",
      margin: "0 0 15px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    video: {
      width: "100%",
      height: "210px",
      borderRadius: "16px",
      backgroundColor: "#1f2937",
      objectFit: "cover",
      transform: "scaleX(-1)",
    },
    rightPane: {
      flex: "2",
      backgroundColor: "#ffffff",
      borderRadius: "24px",
      padding: "40px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #f1f5f9",
      paddingBottom: "20px",
      marginBottom: "25px",
    },
    roomTitle: {
      margin: 0,
      fontSize: "20px",
      fontWeight: "800",
      color: "#0f172a",
    },
    badge: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      padding: "6px 14px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "700",
    },
    questionBox: {
      backgroundColor: "#f8fafc",
      borderLeft: "4px solid #2563eb",
      padding: "24px",
      borderRadius: "0 12px 12px 0",
      fontSize: "18px",
      lineHeight: "1.6",
      fontWeight: "700",
      color: "#0f172a",
      marginBottom: "30px",
    },
    textareaWrapper: {
      position: "relative",
      marginBottom: "25px",
    },
    textarea: {
      width: "100%",
      minHeight: "150px",
      padding: "20px 60px 20px 20px",
      borderRadius: "14px",
      border: "1px solid #cbd5e1",
      fontSize: "15px",
      fontFamily: "inherit",
      boxSizing: "border-box",
      resize: "vertical",
      color: "#334155",
      backgroundColor: "#ffffff",
      lineHeight: "1.5",
    },
    micButton: {
      position: "absolute",
      right: "20px",
      bottom: "20px",
      backgroundColor: isListening ? "#ef4444" : "#2563eb",
      color: "#ffffff",
      border: "none",
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
      transition: "all 0.2s ease",
    },
    button: {
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: "700",
      color: "#ffffff",
      backgroundColor: "#2563eb",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
      float: "right",
    },
    loadingText: {
      textAlign: "center",
      fontSize: "18px",
      color: "#64748b",
      margin: "40px 0",
    },
  };

  if (loading) {
    return (
      <div
        style={{ ...styles.rightPane, maxWidth: "700px", margin: "100px auto" }}
      >
        <div style={styles.loadingText}>
          Loading dynamic question tracking...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.layout}>
      {/* MONITOR PANE PANEL */}
      <div style={styles.leftPane}>
        <div style={styles.proctorCard}>
          <p style={styles.proctorTitle}>
            <span style={{ color: "#ef4444" }}>🔴</span> PROCTOR MONITORING
            ACTIVE
          </p>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={styles.video}
          />
        </div>
      </div>

      {/* QUESTION CONTENT CARD */}
      <div style={styles.rightPane}>
        <div style={styles.header}>
          <h3 style={styles.roomTitle}>Technical Interview Room</h3>
          <span style={styles.badge}>Question {questionId} of 5</span>
        </div>

        {error && (
          <p
            style={{
              color: "#dc2626",
              fontWeight: "600",
              marginBottom: "15px",
            }}
          >
            ⚠️ {error}
          </p>
        )}

        <div style={styles.questionBox}>{question}</div>

        <form onSubmit={handleFormSubmit}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#64748b",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px",
              letterSpacing: "0.5px",
            }}
          >
            YOUR ANSWER:
          </label>
          <div style={styles.textareaWrapper}>
            <textarea
              style={styles.textarea}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your description text or utilize the microphone dictation switch..."
              required
            />

            <button
              type="button"
              onClick={toggleListening}
              style={styles.micButton}
              title={
                isListening ? "Stop voice dictation" : "Start voice dictation"
              }
            >
              {isListening ? "🛑" : "🎤"}
            </button>
          </div>

          <div style={{ overflow: "hidden" }}>
            <button type="submit" disabled={submitting} style={styles.button}>
              {submitting ? "Submitting..." : "Submit Answer ➡️"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewRoom;
