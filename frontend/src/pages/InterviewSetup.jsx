import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/interviewSetup.css";

function InterviewSetup() {

    const navigate = useNavigate();

    const roleData = {

        "Computer Science": [
            "Frontend Developer",
            "Backend Developer",
            "React Developer",
            "Full Stack Developer",
            "Java Developer",
            "Python Developer",
            "PHP Developer",
            "Node.js Developer",
            "Software Engineer",
            "AI Engineer",
            "Data Scientist"
        ],

        "Information Technology": [
            "System Administrator",
            "Cloud Engineer",
            "DevOps Engineer",
            "Network Engineer",
            "Technical Support Engineer"
        ],

        "Artificial Intelligence": [
            "Machine Learning Engineer",
            "AI Engineer",
            "Deep Learning Engineer",
            "NLP Engineer"
        ],

        "Cyber Security": [
            "Security Analyst",
            "Ethical Hacker",
            "SOC Analyst",
            "Penetration Tester"
        ],

        "Data Science": [
            "Data Scientist",
            "Data Analyst",
            "Business Intelligence Developer"
        ],

        "Electronics": [
            "Embedded Engineer",
            "VLSI Engineer",
            "PCB Design Engineer"
        ],

        "Mechanical": [
            "Design Engineer",
            "Production Engineer",
            "Quality Engineer"
        ],

        "Civil": [
            "Site Engineer",
            "Structural Engineer"
        ],

        "MBA": [
            "HR Executive",
            "Business Analyst",
            "Marketing Executive",
            "Sales Executive",
            "Project Manager"
        ]

    };

    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("Fresher");
    const [difficulty, setDifficulty] = useState("Easy");
    const [interviewType, setInterviewType] = useState("Technical");
    const [resume, setResume] = useState(null);

    const handleResume = (e) => {

        if (e.target.files.length > 0) {

            setResume(e.target.files[0]);

        }

    };

    const startInterview = () => {

        if (!department) {

            alert("Please select a department.");

            return;

        }

        if (!role) {

            alert("Please select a job role.");

            return;

        }

        if (!resume) {

            alert("Please upload your resume.");

            return;

        }

        navigate("/interview", {

            state: {

                department,
                role,
                experience,
                difficulty,
                interviewType,
                resumeName: resume.name

            }

        });

    };

    return (

        <div className="setup-page">

            <div className="setup-card">

                <h1>🤖 AI Interview Setup</h1>

                <p>

                    Choose your interview preferences before starting.

                </p>

                {/* Department */}

                <div className="form-group">

                    <label>Department</label>

                    <select

                        value={department}

                        onChange={(e) => {

                            setDepartment(e.target.value);

                            setRole("");

                        }}

                    >

                        <option value="">

                            Select Department

                        </option>

                        {

                            Object.keys(roleData).map((dept) => (

                                <option

                                    key={dept}

                                    value={dept}

                                >

                                    {dept}

                                </option>

                            ))

                        }

                    </select>

                </div>

                {/* Job Role */}

                <div className="form-group">

                    <label>Job Role</label>

                    <select

                        value={role}

                        disabled={!department}

                        onChange={(e) =>

                            setRole(e.target.value)

                        }

                    >

                        <option value="">

                            Select Job Role

                        </option>

                        {

                            department &&

                            roleData[department].map((item) => (

                                <option

                                    key={item}

                                    value={item}

                                >

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>

                {/* Experience */}

                <div className="form-group">

                    <label>Experience</label>

                    <select

                        value={experience}

                        onChange={(e) =>

                            setExperience(e.target.value)

                        }

                    >

                        <option>Fresher</option>

                        <option>1-2 Years</option>

                        <option>3-5 Years</option>

                        <option>5+ Years</option>

                    </select>

                </div>

                {/* Interview Type */}

                <div className="form-group">

                    <label>Interview Type</label>

                    <select

                        value={interviewType}

                        onChange={(e) =>

                            setInterviewType(e.target.value)

                        }

                    >

                        <option>Technical</option>

                        <option>HR</option>

                        <option>Behavioral</option>

                        <option>Aptitude</option>

                    </select>

                </div>

                {/* Difficulty */}

                <div className="form-group">

                    <label>Difficulty</label>

                    <select

                        value={difficulty}

                        onChange={(e) =>

                            setDifficulty(e.target.value)

                        }

                    >

                        <option>Easy</option>

                        <option>Medium</option>

                        <option>Hard</option>

                    </select>

                </div>

                {/* Resume */}

                <div className="form-group">

                    <label>Upload Resume</label>

                    <input

                        type="file"

                        accept=".pdf,.doc,.docx"

                        onChange={handleResume}

                    />

                </div>

                {/* Summary */}

                <div className="summary-card">

                    <h3>📋 Interview Summary</h3>

                    <p><strong>Department:</strong> {department || "-"}</p>

                    <p><strong>Role:</strong> {role || "-"}</p>

                    <p><strong>Experience:</strong> {experience}</p>

                    <p><strong>Interview Type:</strong> {interviewType}</p>

                    <p><strong>Difficulty:</strong> {difficulty}</p>

                    <p><strong>Questions:</strong> 10</p>

                    <p><strong>Estimated Time:</strong> 20 Minutes</p>

                    <p>

                        <strong>Resume:</strong>{" "}

                        {resume ? resume.name : "Not Uploaded"}

                    </p>

                </div>

                <button

                    className="start-btn"

                    onClick={startInterview}

                >

                    🚀 Start AI Interview

                </button>

            </div>

        </div>

    );

}

export default InterviewSetup;