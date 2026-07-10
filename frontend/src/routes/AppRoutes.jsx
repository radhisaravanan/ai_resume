import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import UploadResume from "../pages/UploadResume";
import ResumeAnalysis from "../pages/ResumeAnalysis";
import Instructions from "../pages/Instructions";
import InterviewSetup from "../pages/InterviewSetup";
import Interview from "../pages/Interview";
import Result from "../pages/Result";
import History from "../pages/History";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Features from "../pages/Features";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Resume */}
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />

        {/* Interview */}
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/interview-setup" element={<InterviewSetup />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<Result />} />

        {/* User */}
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />

        {/* Website Pages */}
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
