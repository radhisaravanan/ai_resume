import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
<<<<<<< HEAD
import Permission from "./pages/permission";
import Dashboard from "./pages/Dashboard";
=======
import InterviewSetup from "./pages/InterviewSetup";
import Permission from "./pages/Permission";
import Report from "./pages/Report";

// Other Pages
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Setup from "./pages/Setup";
import Features from "./pages/Features";

import About from "./pages/About";

// FIXED PATH: Pointing back to your pages directory
>>>>>>> 3461b9ea548a700e50910214c1c1e88dd8a0ea22
import InterviewRoom from "./pages/InterviewRoom";
import Report from "./pages/Report";
import { StageGuard } from "./components/StageGuard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pathways */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Sequential Stage Gates */}
        <Route
          path="/resume"
          element={
            <StageGuard requiredStage={3}>
              <ResumeAnalyzer />
            </StageGuard>
          }
        />
        <Route
          path="/permissions"
          element={
            <StageGuard requiredStage={4}>
              <Permission />
            </StageGuard>
          }
        />
        <Route
          path="/dashboard"
          element={
            <StageGuard requiredStage={5}>
              <Dashboard />
            </StageGuard>
          }
        />
        <Route
          path="/interview/:questionId"
          element={
            <StageGuard requiredStage={6}>
              <InterviewRoom />
            </StageGuard>
          }
        />
        <Route
          path="/report"
          element={
            <StageGuard requiredStage={7}>
              <Report />
            </StageGuard>
          }
        />
<<<<<<< HEAD
=======
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

         <Route path="/Features" element={<Features/>} />

          <Route path="/About" element={<About/>} />

        {/* ===========================
            404 Page
        =========================== */}
        <Route path="*" element={<NotFound />} />
>>>>>>> 3461b9ea548a700e50910214c1c1e88dd8a0ea22
      </Routes>
    </Router>
  );
}

// CRUCIAL EXPORT: This directly fixes the "does not provide an export named 'default'" crash!
export default App;
