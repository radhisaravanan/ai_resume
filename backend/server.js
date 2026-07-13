const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ==========================
// Database Connection
// ==========================
require("./config/db");

// ==========================
// Import Routes
// ==========================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

console.log("✅ Routes Imported Successfully");

// ==========================
// Middleware
// ==========================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ==========================
// Static Files
// ==========================

app.use("/uploads", express.static("uploads"));

// ==========================
// API Routes
// ==========================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/interview", interviewRoutes);

app.use("/api/voice", voiceRoutes);

app.use("/api/evaluation", evaluationRoutes);
app.use("/api/performance", performanceRoutes);
// ==========================
// Default Route
// ==========================

app.get("/", (req, res) => {
  res.json({
    success: true,

    message: "AI Interview Backend is Running 🚀",
  });
});

// ==========================
// 404 Handler
// ==========================

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: "Route Not Found",
  });
});

// ==========================
// Global Error Handling
// ==========================

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
