import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

import API from "../services/api";

import "../assets/css/interviewSetup.css";

function InterviewSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Resume data from Resume Analyzer
  const resumeData = location.state;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    analysis: resumeData?.analysis || null,

    department: "",

    domain: "",

    company: "",

    role: "",

    experience: "Fresher",

    questions: "5",

    language: "English",

    resume: null,
  });

  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Resume Upload
  // ==========================

  const handleResume = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({
        ...form,

        resume: file,
      });
    }
  };

  // ==========================
  // Start Interview
  // ==========================

  const startInterview = async () => {
    if (!form.resume) {
      alert("Please upload your resume.");

      return;
    }

    if (!form.department) {
      alert("Please select your department.");

      return;
    }

    if (!form.domain) {
      alert("Please select your domain.");

      return;
    }

    if (!form.role) {
      alert("Please enter your job role.");

      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/interview/start", {
        department: form.department,

        domain: form.domain,

        role: form.role,

        experience: form.experience,

        questions: form.questions,

        language: form.language,
      });

      if (response.data.success) {
        localStorage.setItem("sessionId", response.data.sessionId);

        localStorage.setItem("interviewSetup", JSON.stringify(form));

        navigate("/permission");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);

      alert("Unable to start interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-card">
        <h1>Smart Interview Setup</h1>

        {/* Department */}

        <div className="form-group">
          <label>Department</label>

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>

            <option>Computer Science</option>

            <option>Information Technology</option>

            <option>Electronics</option>

            <option>Mechanical</option>
          </select>
        </div>

        {/* Domain */}

        <div className="form-group">
          <label>Domain</label>

          <select name="domain" value={form.domain} onChange={handleChange}>
            <option value="">Select Domain</option>

            <option>Web Development</option>

            <option>React JS</option>

            <option>Node JS</option>

            <option>Java</option>

            <option>Python</option>

            <option>Data Science</option>

            <option>Artificial Intelligence</option>
          </select>
        </div>

        {/* Job Role */}

        <div className="form-group">
          <label>Job Role</label>

          <input
            type="text"
            name="role"
            value={form.role}
            placeholder="Frontend Developer"
            onChange={handleChange}
          />
        </div>

        {/* Experience */}

        <div className="form-group">
          <label>Experience</label>

          <select
            name="experience"
            value={form.experience}
            onChange={handleChange}
          >
            <option>Fresher</option>

            <option>1 Year</option>

            <option>2 Years</option>

            <option>3+ Years</option>
          </select>
        </div>

        {/* Number of Questions */}

        <div className="form-group">
          <label>Questions</label>

          <select
            name="questions"
            value={form.questions}
            onChange={handleChange}
          >
            <option>5</option>

            <option>10</option>

            <option>15</option>
          </select>
        </div>

        {/* Language */}

        <div className="form-group">
          <label>Language</label>

          <select name="language" value={form.language} onChange={handleChange}>
            <option>English</option>

            <option>Tamil</option>
          </select>
        </div>

        {/* Resume Analysis */}

        {form.analysis && (
          <div className="analysis-box">
            <h3>Resume Analysis</h3>

            <p>
              <strong>ATS Score :</strong> {form.analysis.ats}%
            </p>

            <p>
              <strong>Resume Match :</strong> {form.analysis.match}%
            </p>
          </div>
        )}

        {/* Resume Upload */}

        <div className="form-group">
          <label>Upload Resume</label>

          <div className="resume-upload">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResume}
            />
          </div>

          {form.resume && <p>✅ {form.resume.name}</p>}
        </div>

        {/* Start Button */}

        <button
          className="start-button"
          onClick={startInterview}
          disabled={loading}
        >
          <FaPlay />

          {loading ? "Starting Interview..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
}

export default InterviewSetup;