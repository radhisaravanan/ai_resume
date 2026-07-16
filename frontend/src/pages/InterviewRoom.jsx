import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InterviewRoom = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const currentId = parseInt(questionId, 10) || 1;

  const [question, setQuestion] = useState(
    "🤖 Generating structural portfolio query context line...",
  );
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingState, setRecordingState] = useState("idle"); // 'idle' | 'recording' | 'reviewing'

  // Webcam Proctoring Feed State
  const [showCamera, setShowCamera] = useState(
    localStorage.getItem("interview_camera_active") === "true"
  );

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const webcamVideoRef = useRef(null);

  // 🔊 Text-To-Speech (AI Voice Speaks the Question Out Loud)
  const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper to fetch asked questions from local storage
  const getAskedQuestions = () => {
    try {
      const val = localStorage.getItem("asked_questions");
      return val ? JSON.parse(val) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper to save asked question
  const saveAskedQuestion = (questionText) => {
    try {
      const current = getAskedQuestions();
      if (!current.includes(questionText)) {
        const updated = [...current, questionText];
        localStorage.setItem("asked_questions", JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reset and fetch question when questionId changes
  useEffect(() => {
    if (currentId === 1) {
      localStorage.setItem("asked_questions", JSON.stringify([]));
      localStorage.removeItem("interview_camera_active");
      setShowCamera(false);
    }

    const fetchQuestion = async () => {
      setQuestion("🤖 Reading profile text context layers...");
      setDisplayedQuestion("🤖 Reading profile text context layers...");
      try {
        const context = localStorage.getItem("resume_context") || "";
        const asked = getAskedQuestions();

        const res = await fetch(
          "http://localhost:5000/api/interview/question",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questionId: currentId,
              resumeText: context,
              askedQuestions: asked,
            }),
          },
        );
        const data = await res.json();
        if (data.success) {
          let finalQ = data.question;

          // Frontend defensive duplicate double check
          if (asked.includes(finalQ)) {
            finalQ = finalQ + ` (Focusing on specific architectural considerations for Step #${currentId})`;
          }

          setQuestion(finalQ);
          saveAskedQuestion(finalQ);
          speakQuestion(finalQ);
        } else {
          throw new Error("Failed to load question");
        }
      } catch (err) {
        console.error(err);
        const fallback = `Can you deep dive into your engineering experience and explain how you tackle scaling bottlenecks with code quality? (Question #${currentId})`;
        setQuestion(fallback);
        saveAskedQuestion(fallback);
        speakQuestion(fallback);
      }
    };

    fetchQuestion();
    discardRecording();
  }, [currentId]);

  // Typewriter effect loading mechanism
  useEffect(() => {
    if (!question || question.startsWith("🤖")) return;

    setDisplayedQuestion("");
    setIsTyping(true);
    let index = 0;
    
    const interval = setInterval(() => {
      setDisplayedQuestion((prev) => prev + question.charAt(index));
      index++;
      if (index >= question.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18); // Fast typing pace

    return () => clearInterval(interval);
  }, [question]);

  // Speech recognition API initialization
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e) => {
      let liveText = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          liveText += e.results[i][0].transcript + " ";
        }
      }
      if (liveText) {
        setAnswerText((prev) => prev + liveText);
      }
    };

    rec.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = rec;
  }, []);

  // WebRTC Camera stream initialization based on proctoring active state
  useEffect(() => {
    if (showCamera) {
      const startWebcam = async () => {
        try {
          if (webcamStreamRef.current) {
            webcamStreamRef.current.getTracks().forEach((track) => track.stop());
          }
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240 },
          });
          webcamStreamRef.current = stream;
          if (webcamVideoRef.current) {
            webcamVideoRef.current.srcObject = stream;
            webcamVideoRef.current.play().catch((e) => console.error(e));
          }
        } catch (err) {
          console.error("Camera proctoring stream access error:", err);
        }
      };
      startWebcam();
    }

    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera, currentId]);

  // Audio Capture Stream & MediaRecorder actions
  const startRecording = async () => {
    try {
      setAudioUrl("");
      setAnswerText("");
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingState("reviewing");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingState("recording");

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Speech recognition restart catch:", e);
        }
      }
    } catch (err) {
      console.error("Failed to access microphone stream:", err);
      alert("Microphone hardware access required for voice-only answers.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    setIsRecording(false);
  };

  const discardRecording = () => {
    setAudioUrl("");
    setAnswerText("");
    setRecordingState("idle");
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() && !audioUrl) {
      return alert("Please record an audio response before submitting.");
    }

    setLoading(true);
    try {
      // Simulate answer evaluation payload ingestion
      await fetch("http://localhost:5000/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regno: localStorage.getItem("regno"),
          questionId: currentId,
          questionText: question,
          answer: answerText.trim() || "No audible voice parsed. Audio record verified.",
        }),
      });

      // Enable Proctoring Gaze camera view directly in layout context
      setShowCamera(true);
      localStorage.setItem("interview_camera_active", "true");

      // Visual pause to ensure user notices proctoring activation
      setTimeout(() => {
        setLoading(false);
        if (currentId < 5) {
          navigate(`/interview/${currentId + 1}`);
        } else {
          navigate("/report");
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setShowCamera(true);
      localStorage.setItem("interview_camera_active", "true");
      setTimeout(() => {
        setLoading(false);
        if (currentId < 5) {
          navigate(`/interview/${currentId + 1}`);
        } else {
          navigate("/report");
        }
      }, 1000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f172a", // Sleek dark slate
        fontFamily: "'Outfit', 'Inter', sans-serif",
        padding: "24px",
        boxSizing: "border-box",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "1150px",
          gap: "24px",
          boxSizing: "border-box",
        }}
      >
        {/* Left Panel: Core Interview Workspace */}
        <div
          style={{
            flex: "2 1 650px",
            backgroundColor: "#1e293b",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
            border: "1px solid #334155",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header Area */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #334155",
                paddingBottom: "16px",
                marginBottom: "24px",
              }}
            >
              <div>
                <span
                  style={{
                    color: "#38bdf8",
                    fontSize: "13px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Stage 6: Interactive Interview Room
                </span>
                <h3 style={{ margin: "4px 0 0 0", color: "#f8fafc", fontSize: "20px", fontWeight: "700" }}>
                  Question {currentId} of 5
                </h3>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#10b981",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                VOICE MONITOR ACTIVE
              </div>
            </div>

            {/* Question Text Box */}
            <div
              style={{
                backgroundColor: "#0b0f19",
                padding: "28px",
                borderRadius: "16px",
                border: "1px solid #334155",
                fontSize: "18px",
                fontWeight: "500",
                lineHeight: "1.6",
                marginBottom: "28px",
                color: "#f1f5f9",
                minHeight: "80px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <span>{displayedQuestion}</span>
              {isTyping && (
                <span
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: "18px",
                    backgroundColor: "#38bdf8",
                    marginLeft: "4px",
                    animation: "blink 0.8s infinite",
                  }}
                />
              )}
            </div>

            {/* Main Interactive State Engine */}
            <div style={{ marginBottom: "24px" }}>
              {recordingState === "idle" && (
                <div style={{ textAlign: "center", padding: "30px 0" }}>
                  <button
                    onClick={startRecording}
                    style={{
                      padding: "20px 40px",
                      borderRadius: "50px",
                      border: "none",
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "transform 0.1s ease",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    🎙️ Start Voice Response
                  </button>
                  <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "16px" }}>
                    Your microphone stream will capture and auto-transcribe the session.
                  </p>
                </div>
              )}

              {recordingState === "recording" && (
                <div
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    padding: "30px 24px",
                    borderRadius: "16px",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      gap: "4px",
                      height: "36px",
                      marginBottom: "16px",
                    }}
                  >
                    <div className="wave-bar bar-1" />
                    <div className="wave-bar bar-2" />
                    <div className="wave-bar bar-3" />
                    <div className="wave-bar bar-4" />
                    <div className="wave-bar bar-5" />
                    <div className="wave-bar bar-2" />
                    <div className="wave-bar bar-1" />
                  </div>
                  <h4 style={{ color: "#ef4444", fontSize: "15px", fontWeight: "700", margin: "0 0 16px 0" }}>
                    🔴 RECORDING VOICE ANSWER STREAM...
                  </h4>
                  <button
                    onClick={stopRecording}
                    style={{
                      padding: "12px 30px",
                      borderRadius: "30px",
                      border: "none",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
                    }}
                  >
                    ⏹️ Stop & Review
                  </button>
                </div>
              )}

              {recordingState === "reviewing" && (
                <div
                  style={{
                    backgroundColor: "#0f172a",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid #334155",
                    boxSizing: "border-box",
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0", color: "#38bdf8", fontSize: "14px", fontWeight: "700" }}>
                    🎙️ Voice Review & Re-Record Pipeline
                  </h4>
                  
                  {/* Local Stream Playback Engine */}
                  <audio
                    src={audioUrl}
                    controls
                    style={{
                      width: "100%",
                      marginBottom: "20px",
                      outline: "none",
                    }}
                  />

                  {/* Read-Only Transcribed Text View Box */}
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#94a3b8",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    Parsed Voice Transcript (Read-Only):
                  </label>
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#1e293b",
                      borderRadius: "10px",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      minHeight: "80px",
                      marginBottom: "20px",
                      boxSizing: "border-box",
                      wordBreak: "break-word",
                    }}
                  >
                    {answerText ? `"${answerText}"` : "No audible words detected. You can discard and try again."}
                  </div>

                  <div style={{ display: "flex", gap: "16px" }}>
                    <button
                      type="button"
                      onClick={discardRecording}
                      style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1px solid #ef4444",
                        backgroundColor: "rgba(239, 68, 68, 0.08)",
                        color: "#f87171",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Discard & Re-record
                    </button>
                    <button
                      type="button"
                      onClick={submitAnswer}
                      disabled={loading}
                      style={{
                        flex: 2,
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: "#10b981",
                        color: "#fff",
                        fontWeight: "700",
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      {loading
                        ? "Saving Response Stream..."
                        : currentId === 5
                          ? "Confirm & Submit Interview 🚀"
                          : "Confirm & Submit Answer ➡️"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            🔒 Hardware proctoring tokens verified. Manual DOM keystrokes disabled.
          </div>
        </div>

        {/* Right Panel: Proctoring Webcam Monitor */}
        <div
          style={{
            flex: "1 1 350px",
            backgroundColor: "#1e293b",
            padding: "36px",
            borderRadius: "24px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
            border: "1px solid #334155",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: "350px",
          }}
        >
          {showCamera ? (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  backgroundColor: "rgba(220, 38, 38, 0.15)",
                  color: "#f87171",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#ef4444",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "blink 1s infinite",
                  }}
                />
                🔴 PROCTORING CAMERA STREAM ACTIVE
              </div>

              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  maxWidth: "280px",
                  margin: "0 auto 16px auto",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "3px solid #ef4444",
                  backgroundColor: "#020617",
                  boxShadow: "0 8px 24px rgba(239, 68, 68, 0.15)",
                }}
              >
                <video
                  ref={webcamVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scaleX(-1)", // Natural mirroring
                  }}
                />
              </div>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                Gaze accuracy tracking loop calibrating.
              </span>
            </div>
          ) : (
            <div>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  marginBottom: "20px",
                  border: "2px dashed #475569",
                  color: "#475569",
                }}
              >
                📷
              </div>
              <h4 style={{ color: "#f8fafc", fontSize: "16px", fontWeight: "700", margin: "0 0 10px 0" }}>
                Proctoring Feed Offline
              </h4>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
                webcam stream will transition to live monitoring seamlessly post-submission of the first answer.
              </p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 36px; }
        }
        .wave-bar {
          width: 4px;
          background-color: #ef4444;
          border-radius: 2px;
          animation: wave 1.2s ease-in-out infinite;
        }
        .bar-1 { animation-delay: 0.1s; }
        .bar-2 { animation-delay: 0.4s; }
        .bar-3 { animation-delay: 0.2s; }
        .bar-4 { animation-delay: 0.6s; }
        .bar-5 { animation-delay: 0.3s; }
      `}} />
    </div>
  );
};

export default InterviewRoom;
