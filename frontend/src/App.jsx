// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Authentication
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Interview Flow
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import InterviewSetup from "./pages/InterviewSetup";
import Permission from "./pages/Permission";
import Report from "./pages/Report";

// Other Pages
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Setup from "./pages/Setup";

// FIXED PATH: Pointing back to your pages directory
import InterviewRoom from "./pages/InterviewRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===========================
            Authentication
        =========================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===========================
            Dashboard
        =========================== */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ===========================
            Resume Upload & Analyzer
        =========================== */}
        <Route path="/resume" element={<ResumeAnalyzer />} />

        {/* ===========================
            Interview Setup
        =========================== */}
        <Route path="/setup" element={<InterviewSetup />} />

        {/* ===========================
            Permission Page
        =========================== */}
        <Route path="/permission" element={<Permission />} />

        {/* ===========================
            Interview Room (UPDATED PARAMETER KEY)
        =========================== */}
        <Route
          path="/interview"
          element={<Navigate to="/interview/1" replace />}
        />
        <Route path="/interview/:questionId" element={<InterviewRoom />} />

        {/* ===========================
            Final Report
        =========================== */}
        <Route path="/report/:sessionId" element={<Report />} />

        {/* ===========================
            Interview History
        =========================== */}
        <Route path="/history" element={<InterviewHistory />} />

        {/* ===========================
            Profile
        =========================== */}
        <Route path="/profile" element={<Profile />} />

        {/* ===========================
            404 Page
        =========================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
