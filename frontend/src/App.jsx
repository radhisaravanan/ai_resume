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
import Dashboard from "./pages/Dashboard";
import InterviewRoom from "./pages/InterviewRoom";
import Report from "./pages/Report";

// ✅ Updated dynamic matching parameter linking path to permission.jsx cleanly
import Permission from "./pages/permission";

function App() {
  return (
    <Router>
      <Routes>
        {/* Baseline Routing Structure Context Setup */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Process Flow Stages Mapping */}
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/permissions" element={<Permission />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Dynamic Parameter Execution Sequence Maps */}
        <Route path="/interview/:questionId" element={<InterviewRoom />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
