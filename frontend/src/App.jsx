import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import InterviewRoom from "./pages/InterviewRoom";
import Report from "./pages/Report";

// Extra Pages
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
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

        {/* Interview Flow */}
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/setup" element={<InterviewSetup />} />
        <Route path="/permission" element={<Permission />} />
        <Route path="/interview" element={<InterviewRoom />} />
        <Route path="/report" element={<Report />} />

        {/* Other Pages */}
        <Route path="/history" element={<InterviewHistory />} />
        <Route path="/profile" element={<Profile />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
