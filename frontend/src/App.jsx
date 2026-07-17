// frontend/src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Permission from "./pages/Permission";
import Report from "./pages/Report";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import InterviewRoom from "./pages/InterviewRoom";

import { StageGuard } from "./components/StageGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <StageGuard requiredStage={1}>
              <Profile />
            </StageGuard>
          }
        />

        <Route
          path="/history"
          element={
            <StageGuard requiredStage={1}>
              <History />
            </StageGuard>
          }
        />

        <Route
          path="/resume"
          element={
            <StageGuard requiredStage={3}>
              <ResumeAnalyzer />
            </StageGuard>
          }
        />

        <Route
          path="/permission"
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
          path="/interview"
          element={<Navigate to="/interview/1" replace />}
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

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
