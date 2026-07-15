import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Added for routing transitions

const InterviewRoom = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams(); // Retrieves session ID if defined in the URL route
  const currentSessionId = sessionId || "latest";

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Pipeline steps: 'idle' | 'recording' | 'transcribing' | 'reviewing' | 'completed'
  const [currentStep, setCurrentStep] = useState("idle");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcribedText, setTranscribedText] = useState("");

  // Progress & Interview Records
  const [questionNumber, setQuestionNumber] = useState(1);
  const [interviewRecord, setInterviewRecord] = useState([]); // List of { question, answer }

  // Ref keeps track of asked questions across re-renders to prevent state lag duplicates
  const askedQuestionsRef = useRef([]);

  // Final aggregate assessment states
  const [finalResult, setFinalResult] = useState(null);
  const [isGrading, setIsGrading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  // Initialize webcam and fetch Question #1
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraStream(stream);
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startWebcam();

    // Fetch first question with clean slate
    fetchNextQuestion(1, []);

    return () => {
      // Clean up camera on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech: Speak question aloud safely
  const speakQuestion = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (!currentQuestion) return;
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (currentQuestion && currentStep === "idle") {
      speakQuestion();
    }
  }, [currentQuestion, currentStep]);

  // Request next customized, non-repeated question
  const fetchNextQuestion = async (num, currentAskedList) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/evaluation/next-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            questionNumber: num,
            askedQuestions: currentAskedList,
          }),
        },
      );
      const data = await response.json();
      if (data.success && data.question) {
        setCurrentQuestion(data.question);
        askedQuestionsRef.current = [...currentAskedList, data.question];
      } else {
        const defaultQ =
          "Can you describe how you structure responsive web layouts?";
        setCurrentQuestion(defaultQ);
        askedQuestionsRef.current = [...currentAskedList, defaultQ];
      }
    } catch (err) {
      console.error("Error fetching next question:", err);
      const fallbackQ =
        "Explain your experience with standard debugging tools.";
      setCurrentQuestion(fallbackQ);
      askedQuestionsRef.current = [...currentAskedList, fallbackQ];
    }
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    setTranscribedText("");
    setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setCurrentStep("recording");
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      // Instantly start transcription
      setCurrentStep("transcribing");
      setTimeout(() => {
        handleTranscription();
      }, 500);
    }
  };

  // Convert Voice to Text
  const handleTranscription = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("question", currentQuestion);
    formData.append("interview_id", currentSessionId);

    try {
      const uploadResponse = await fetch(
        "http://localhost:5000/api/voice/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        },
      );
      const uploadData = await uploadResponse.json();
      const parsedText = uploadData.success
        ? uploadData.transcript
        : "No clear voice answer was transcriptionally matched.";

      setTranscribedText(parsedText);
      setCurrentStep("reviewing");
    } catch (error) {
      console.error("Transcription error:", error);
      setTranscribedText(
        "Voice input processing bypass. Manual answer logged.",
      );
      setCurrentStep("reviewing");
    }
  };

  // Submit Answer & continue to next stage
  const submitAnswer = async () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop talking before switching questions
    }

    const finalAnswerText = transcribedText || "No answer registered.";
    const updatedRecord = [
      ...interviewRecord,
      { question: currentQuestion, answer: finalAnswerText },
    ];
    setInterviewRecord(updatedRecord);

    // Reset current audio assets
    setAudioUrl(null);
    setTranscribedText("");
    audioChunksRef.current = [];

    if (questionNumber < 10) {
      const nextNum = questionNumber + 1;
      setQuestionNumber(nextNum);
      setCurrentStep("idle");
      // Synchronously feed the update-locked ref history array
      fetchNextQuestion(nextNum, askedQuestionsRef.current);
    } else {
      setCurrentStep("completed");
      await evaluateAllAnswers(updatedRecord);
    }
  };

  // Trigger final grading and transition cleanly
  const evaluateAllAnswers = async (finalRecord) => {
    setIsGrading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/evaluation/final-grade",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ interviewData: finalRecord }),
        },
      );
      const data = await response.json();

      setFinalResult({
        score: data.score || 75,
        feedback: data.feedback || "Evaluation processing complete.",
      });

      // Redirect directly to the dedicated assessment summary view page
      setTimeout(() => {
        navigate(`/report/${currentSessionId}`);
      }, 3000);
    } catch (err) {
      console.error("Grading failed:", err);
      setFinalResult({
        score: 70,
        feedback:
          "Routing fallback complete. Redirecting you to your report card...",
      });
      setTimeout(() => {
        navigate(`/report/${currentSessionId}`);
      }, 3000);
    } finally {
      setIsGrading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#1f2937",
    },
    header: {
      fontSize: "24px",
      fontWeight: "800",
      textAlign: "center",
      marginBottom: "20px",
      borderBottom: "2px solid #f3f4f6",
      paddingBottom: "16px",
      color: "#111827",
    },
    progressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "700",
      color: "#4b5563",
      marginBottom: "14px",
    },
    progressBarOuter: {
      width: "100%",
      height: "8px",
      backgroundColor: "#e5e7eb",
      borderRadius: "9999px",
      marginBottom: "24px",
      overflow: "hidden",
    },
    progressBarInner: {
      height: "100%",
      backgroundColor: "#2563eb",
      transition: "width 0.4s ease",
    },
    layoutGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      marginBottom: "24px",
    },
    cameraFeed: {
      width: "100%",
      height: "240px",
      backgroundColor: "#1f2937",
      borderRadius: "12px",
      objectFit: "cover",
      transform: "scaleX(-1)",
    },
    questionBox: {
      backgroundColor: "#eff6ff",
      borderLeft: "4px solid #3b82f6",
      padding: "16px",
      borderRadius: "8px",
      position: "relative",
      marginBottom: "16px",
    },
    questionLabel: {
      fontSize: "11px",
      textTransform: "uppercase",
      color: "#2563eb",
      fontWeight: "700",
      margin: "0 0 4px 0",
    },
    questionText: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e3a8a",
      margin: 0,
      paddingRight: "40px",
      lineHeight: "1.4",
    },
    controlArea: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f9fafb",
      borderRadius: "12px",
      border: "2px dashed #e5e7eb",
    },
    recordBtn: {
      padding: "12px 28px",
      fontSize: "15px",
      fontWeight: "600",
      color: "#ffffff",
      backgroundColor: "#dc2626",
      border: "none",
      borderRadius: "9999px",
      cursor: "pointer",
    },
    stopBtn: {
      padding: "12px 28px",
      fontSize: "15px",
      fontWeight: "600",
      color: "#ffffff",
      backgroundColor: "#1f2937",
      border: "none",
      borderRadius: "9999px",
      cursor: "pointer",
    },
    submitBtn: {
      width: "100%",
      padding: "12px",
      fontSize: "15px",
      fontWeight: "700",
      color: "#ffffff",
      backgroundColor: "#2563eb",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "12px",
    },
    responseReviewArea: {
      width: "100%",
      marginTop: "16px",
      padding: "16px",
      backgroundColor: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: "8px",
    },
  };

  // 1. FINAL RESULT / REDIRECTING SCREEN
  if (currentStep === "completed") {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>🎓 Interview Completed</h2>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontSize: "18px", fontWeight: "700", color: "#4b5563" }}>
            🧠 Processing performance assessment results...
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "10px" }}>
            Hold on! We are redirecting you to your interactive assessment
            report card.
          </p>
        </div>
      </div>
    );
  }

  // 2. ACTIVE INTERVIEW INTERFACE
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🎙️ Dynamic AI Resume Interview</h2>

      {/* Progress Bar */}
      <div>
        <div style={styles.progressHeader}>
          <span>Structured Technical Stage</span>
          <span>{questionNumber} / 10 Questions</span>
        </div>
        <div style={styles.progressBarOuter}>
          <div
            style={{
              ...styles.progressBarInner,
              width: `${(questionNumber / 10) * 100}%`,
            }}
          />
        </div>
      </div>

      <div style={styles.layoutGrid}>
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "700",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            📹 Live Camera
          </h3>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={styles.cameraFeed}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={styles.questionBox}>
              <p style={styles.questionLabel}>
                Question {questionNumber} of 10
              </p>
              <p style={styles.questionText}>
                {currentQuestion ||
                  "Analyzing resume to generate custom question..."}
              </p>
              <button
                title="Read out loud"
                onClick={speakQuestion}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "20px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                🔊
              </button>
            </div>
          </div>

          <div style={styles.controlArea}>
            <div style={{ marginBottom: "10px" }}>
              {currentStep !== "transcribing" &&
                (!isRecording ? (
                  <button onClick={startRecording} style={styles.recordBtn}>
                    🔴 Start Recording
                  </button>
                ) : (
                  <button onClick={stopRecording} style={styles.stopBtn}>
                    ⏹️ Stop Recording
                  </button>
                ))}
            </div>

            {currentStep === "transcribing" && (
              <p style={{ margin: 0, fontWeight: "600", color: "#2563eb" }}>
                ⚙️ Transcribing your speech... Please hold.
              </p>
            )}

            {/* Candidate Review Box (Displays both AUDIO player and TRANSCRIBED text) */}
            {currentStep === "reviewing" && (
              <div style={styles.responseReviewArea}>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    color: "#166534",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  📢 Review Your Captured Answer:
                </h4>

                {/* 1. Playback Recorded Voice Component */}
                {audioUrl && (
                  <div style={{ marginBottom: "12px" }}>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#15803d",
                      }}
                    >
                      Your Recorded Voice:
                    </p>
                    <audio src={audioUrl} controls style={{ width: "100%" }} />
                  </div>
                )}

                {/* 2. Text transcription feedback block */}
                <div>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#15803d",
                    }}
                  >
                    Transcribed Text:
                  </p>
                  <div
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                      borderRadius: "6px",
                      border: "1px solid #dcfce7",
                      maxHeight: "100px",
                      overflowY: "auto",
                      fontSize: "13px",
                      color: "#1f2937",
                      fontStyle: "italic",
                    }}
                  >
                    "{transcribedText || "Thinking..."}"
                  </div>
                </div>

                <button onClick={submitAnswer} style={styles.submitBtn}>
                  Submit Answer & Continue ➡️
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
