const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow your React App
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
// Middleware (Fixed CORS)
// ==========================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow both
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// 404 Route
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
// Start Server (Explicit IPv4 Binding)
// ==========================
// Replace your listen block at the bottom of server.js with this:
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
