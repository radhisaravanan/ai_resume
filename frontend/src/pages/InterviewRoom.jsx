import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const InterviewRoom = () => {
  // 🔴 MATCHED WITH APP.JSX: extracted 'questionId' instead of 'id'
  const { questionId } = useParams();
  const navigate = useNavigate();

  // LocalStorage-la irunthu mock questions array query extraction block
  const getQuestionsList = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem("resume_questions_log"));
      if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed;

      const alternativeParsed = JSON.parse(
        localStorage.getItem("interview_questions"),
      );
      if (
        alternativeParsed &&
        Array.isArray(alternativeParsed) &&
        alternativeParsed.length > 0
      )
        return alternativeParsed;
    } catch (e) {
      console.error("Local Storage extraction failed:", e);
    }

    // Static system layout baseline data
    return [
      {
        id: 1,
        questionText:
          "How does the React Virtual DOM optimize UI rendering, and how does reconciliation reduce unnecessary DOM work?",
      },
      {
        id: 2,
        questionText:
          "Compare SQL indexes with sequential scans, and explain when each is preferred in production systems.",
      },
      {
        id: 3,
        questionText:
          "Describe the Node.js event loop and how asynchronous callbacks are processed across phases.",
      },
      {
        id: 4,
        questionText:
          "What are the common RESTful HTTP status code groups and what do they communicate to clients?",
      },
      {
        id: 5,
        questionText:
          "How do JWT signatures protect client-side tokens from tampering, and why is verification critical?",
      },
    ];
  };

  const dynamicQuestionsArray = getQuestionsList();

  // 🔴 PARAMETER RESOLUTION MATRIX USING questionId
  const resolvedIndex = Math.max(
    0,
    Math.min(
      (parseInt(questionId || "1", 10) || 1) - 1,
      dynamicQuestionsArray.length - 1,
    ),
  );

  const [activeQuestion, setActiveQuestion] = useState(
    dynamicQuestionsArray[resolvedIndex],
  );
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechChunks, setSpeechChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [aiStatus, setAiStatus] = useState("Initializing voice stack...");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  const speakQuestion = (questionText) => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setAiStatus("Speaking target question...");
    utterance.onend = () =>
      setAiStatus("Capture ready. Press start to answer.");
    synthesisRef.current.speak(utterance);
  };

  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;
  }, []);

  useEffect(() => {
    const currentQuestion =
      dynamicQuestionsArray[resolvedIndex] || dynamicQuestionsArray[0];
    setActiveQuestion(currentQuestion);
    setSpeechTranscript("");
    setSpeechChunks([]);

    const textToSpeak =
      currentQuestion.questionText || currentQuestion.question;
    speakQuestion(textToSpeak);

    return () => {
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, [resolvedIndex]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAiStatus("Speech capture is not available in this browser.");
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();

      if (transcript) {
        setSpeechChunks((prevChunks) => {
          const nextChunks = [...prevChunks, transcript];
          const joined = nextChunks.join(" ").trim();
          setSpeechTranscript(joined);
          return nextChunks;
        });
      }
    };

    recognition.onerror = (error) => {
      console.error("Speech recognition error", error);
      setAiStatus("Capture interrupted. Please try again.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    let stream = null;
    let cancelled = false;

    const requestCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera access is unavailable in this browser.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraReady(true);
        setCameraError("");
      } catch (error) {
        console.error("Camera access denied", error);
        setCameraError(
          "Camera/Microphone permission was not granted. Allow device access to continue.",
        );
      }
    };

    requestCamera();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setAiStatus("Speech capture is not supported on this device.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setAiStatus("Capture paused.");
      return;
    }

    setSpeechTranscript("");
    setSpeechChunks([]);

    if (synthesisRef.current) synthesisRef.current.cancel();

    recognitionRef.current.start();
    setIsRecording(true);
    setAiStatus("Listening for your answer...");
  };

  const handleNextOrSubmit = () => {
    if (!speechTranscript.trim()) {
      setAiStatus("Speak to capture a transcript before continuing.");
      return;
    }

    setLoadingNext(true);
    setAiStatus("Processing Matrix...");
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    if (synthesisRef.current) synthesisRef.current.cancel();

    const storedResponses = JSON.parse(
      localStorage.getItem("interview_responses_log") || "[]",
    );
    storedResponses.push({
      questionNumber: resolvedIndex + 1,
      questionText: activeQuestion.questionText || activeQuestion.question,
      candidateResponse: speechTranscript,
    });
    localStorage.setItem(
      "interview_responses_log",
      JSON.stringify(storedResponses),
    );

    window.setTimeout(() => {
      setLoadingNext(false);
      if (resolvedIndex < dynamicQuestionsArray.length - 1) {
        // 🔴 MATCHED ROUTE DIRECTION PATH EXTENSION
        navigate(`/interview/${resolvedIndex + 2}`);
      } else {
        localStorage.setItem("highest_stage", "7");
        navigate("/report");
      }
    }, 1200);
  };

  return (
    <div style={pageStyle}>
      <style>{responsiveStyles}</style>
      <div style={shellStyle} className="interview-shell">
        <section style={leftPanelStyle}>
          <div style={headerRowStyle}>
            <div>
              <div style={badgeStyle}>
                Question {resolvedIndex + 1} of {dynamicQuestionsArray.length}
              </div>
              <h1 style={titleStyle}>Live Interview Console</h1>
            </div>
            <div style={statusPillStyle}>{aiStatus}</div>
          </div>

          <div style={metricRowStyle}>
            <div style={metricCardStyle}>
              <div style={metricLabelStyle}>Engine</div>
              <div style={metricValueStyle}>Online</div>
            </div>
            <div style={metricCardStyle}>
              <div style={metricLabelStyle}>Capture</div>
              <div style={metricValueStyle}>
                {isRecording ? "Listening" : "Idle"}
              </div>
            </div>
            <div style={metricCardStyle}>
              <div style={metricLabelStyle}>Status</div>
              <div style={metricValueStyle}>
                {loadingNext ? "Processing" : "Ready"}
              </div>
            </div>
          </div>

          <div style={questionCardStyle}>
            <div style={sectionLabelStyle}>TARGET TECHNICAL QUESTION</div>
            <p style={questionTextStyle}>
              {activeQuestion.questionText || activeQuestion.question}
            </p>
          </div>

          <div style={transcriptCardStyle}>
            <div style={transcriptHeaderStyle}>
              <div style={sectionLabelStyle}>LIVE TRANSCRIPT</div>
              <div style={helperTextStyle}>Speech-only response overlay</div>
            </div>
            <div style={speechOverlayStyle} aria-live="polite" role="status">
              {speechTranscript ||
                "Your spoken answer will appear here in real time."}
            </div>
          </div>

          <div style={actionRowStyle}>
            <button
              type="button"
              onClick={toggleRecording}
              disabled={loadingNext}
              style={{
                ...buttonBaseStyle,
                ...micButtonStyle,
                background: isRecording ? "#dc2626" : "#2563eb",
              }}
            >
              {isRecording
                ? "Stop Capture Microphone"
                : "Start Capture Microphone"}
            </button>

            <button
              type="button"
              onClick={handleNextOrSubmit}
              disabled={loadingNext || !speechTranscript.trim()}
              style={{
                ...buttonBaseStyle,
                ...nextButtonStyle,
                opacity: loadingNext || !speechTranscript.trim() ? 0.65 : 1,
              }}
            >
              {loadingNext
                ? "Processing Matrix..."
                : resolvedIndex < dynamicQuestionsArray.length - 1
                  ? "Next"
                  : "Submit Interview"}
            </button>
          </div>
        </section>

        <aside style={cameraPanelStyle}>
          <div style={cameraHeaderStyle}>
            <div style={sectionLabelStyle}>CAMERA OVERLAY</div>
            <div
              style={{
                ...cameraBadgeStyle,
                background: cameraReady ? "#16a34a" : "#64748b",
              }}
            >
              {cameraReady ? "LIVE" : "WAITING"}
            </div>
          </div>

          <div style={cameraViewportStyle}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={videoStyle}
            />
            {!cameraReady && (
              <div style={cameraPlaceholderStyle}>
                Grant camera access to begin
              </div>
            )}
          </div>

          {cameraError ? (
            <div style={cameraErrorStyle}>{cameraError}</div>
          ) : (
            <div style={cameraHintStyle}>
              Local stream is attached directly to the live overlay surface.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

// ================= STYLES ENGINE =================
const pageStyle = {
  minHeight: "100vh",
  background: "#020617",
  color: "#e2e8f0",
  padding: "24px",
  fontFamily: "Inter, Segoe UI, sans-serif",
};
const shellStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1.4fr 0.8fr",
  gap: "24px",
};
const leftPanelStyle = {
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(2, 6, 23, 0.35)",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};
const headerRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  paddingBottom: "8px",
  borderBottom: "1px solid #1f2937",
};
const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "999px",
  background: "#f97316",
  color: "#fff",
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  width: "fit-content",
};
const titleStyle = {
  margin: "8px 0 0",
  fontSize: "24px",
  fontWeight: 700,
  color: "#f8fafc",
};
const statusPillStyle = {
  background: "rgba(56, 189, 248, 0.16)",
  color: "#7dd3fc",
  border: "1px solid rgba(56, 189, 248, 0.24)",
  borderRadius: "999px",
  padding: "10px 14px",
  fontSize: "13px",
  fontWeight: 600,
};
const metricRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
};
const metricCardStyle = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "14px",
  padding: "12px 14px",
};
const metricLabelStyle = {
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#94a3b8",
};
const metricValueStyle = {
  marginTop: "4px",
  fontSize: "15px",
  color: "#f8fafc",
  fontWeight: 600,
};
const questionCardStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "18px",
  padding: "18px",
};
const sectionLabelStyle = {
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: "8px",
};
const questionTextStyle = {
  color: "#f8fafc",
  fontSize: "19px",
  lineHeight: 1.7,
  margin: 0,
};
const transcriptCardStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "18px",
  padding: "16px",
};
const transcriptHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  marginBottom: "10px",
};
const helperTextStyle = { fontSize: "12px", color: "#94a3b8" };
const speechOverlayStyle = {
  width: "100%",
  minHeight: "140px",
  background: "#111827",
  border: "1px solid #334155",
  color: "#f8fafc",
  borderRadius: "14px",
  padding: "14px",
  fontSize: "14px",
  boxSizing: "border-box",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
};
const actionRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "6px",
};
const buttonBaseStyle = {
  border: "none",
  borderRadius: "14px",
  padding: "12px 18px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  color: "#fff",
};
const micButtonStyle = { background: "#2563eb", flex: "1 1 220px" };
const nextButtonStyle = { background: "#10b981", flex: "1 1 180px" };
const cameraPanelStyle = {
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: "24px",
  padding: "20px",
  boxShadow: "0 24px 60px rgba(2, 6, 23, 0.35)",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};
const cameraHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const cameraBadgeStyle = {
  borderRadius: "999px",
  padding: "6px 10px",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 700,
};
const cameraViewportStyle = {
  position: "relative",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  borderRadius: "18px",
  minHeight: "420px",
  overflow: "hidden",
  border: "1px solid #334155",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const videoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  background: "#020617",
};
const cameraPlaceholderStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#cbd5e1",
  fontSize: "18px",
  fontWeight: 600,
  textAlign: "center",
  padding: "20px",
  background: "rgba(2, 6, 23, 0.72)",
};
const cameraErrorStyle = {
  color: "#fda4af",
  fontSize: "13px",
  lineHeight: 1.5,
};
const cameraHintStyle = { fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 };
const responsiveStyles = `@media (max-width: 980px) { .interview-shell { grid-template-columns: 1fr !important; } }`;

export default InterviewRoom;
