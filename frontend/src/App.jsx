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
import Permission from "./pages/permission";
import Dashboard from "./pages/Dashboard";
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
      </Routes>
    </Router>
  );
}

// CRUCIAL EXPORT: This directly fixes the "does not provide an export named 'default'" crash!
export default App;
