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

        <div className="setup-container">

            <div className="setup-form">

                <div className="page-title">

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                        alt="AI Interview"
                        className="setup-image"
                    />

                    <h1> AI Interview </h1>

                

                </div>

                {/* Department */}

                <div className="input-box">

                    <label>Department</label>

                    <select
                        value={department}
                        onChange={(e) => {
                            setDepartment(e.target.value);
                            setRole("");
                        }}
                    >
                        <option value="">Select Department</option>

                        {Object.keys(roleData).map((dept) => (

                            <option key={dept} value={dept}>
                                {dept}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Job Role */}

                <div className="input-box">

                    <label>Job Role</label>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={!department}
                    >

                        <option value="">Select Job Role</option>

                        {department &&
                            roleData[department].map((job) => (

                                <option key={job} value={job}>
                                    {job}
                                </option>

                            ))}

                    </select>

                </div>

                {/* Experience */}

                <div className="input-box">

                    <label>Experience</label>

                    <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                    >

                        <option>Fresher</option>
                        <option>1-2 Years</option>
                        <option>3-5 Years</option>
                        <option>5+ Years</option>

                    </select>

                </div>

                {/* Interview Type */}

                <div className="input-box">

                    <label>Interview Type</label>

                    <select
                        value={interviewType}
                        onChange={(e) => setInterviewType(e.target.value)}
                    >

                        <option>Technical</option>
                        <option>HR</option>
                        <option>Behavioral</option>
                        <option>Aptitude</option>

                    </select>

                </div>

                {/* Difficulty */}

                <div className="input-box">

                    <label>Difficulty</label>

                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >

                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>

                    </select>

                </div>

                {/* Resume Upload */}

                <div className="upload-box">

                    <label>Upload Resume</label>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResume}
                    />

                    {resume && (

                        <div className="file-name">

                            📄 {resume.name}

                        </div>

                    )}

                </div>

                {/* Start Button */}

                <button
                    className="start-btn"
                    onClick={startInterview}
                >

                    🚀 Start AI Interview

                </button>

            </div>

        </div>

    </div>
);

}

export default InterviewSetup;