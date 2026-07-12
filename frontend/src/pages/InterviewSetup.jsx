import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/interviewSetup.css";

function InterviewSetup() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        domain: "",

        company: "",

        role: "",

        difficulty: "",

        experience: "",

        questions: "5",

        language: "English",

        interviewType: "Voice"

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const startInterview = () => {

        navigate("/permission");

    };

    return (

        <div className="setup-page">

            <div className="setup-card">

                <h1>AI Mock Interview Setup</h1>

                <p>
                    Configure your interview before starting.
                </p>

                <div className="form-group">

                    <label>Domain</label>

                    <select
                        name="domain"
                        onChange={handleChange}
                    >

                        <option>Select Domain</option>

                        <option>Web Development</option>

                        <option>Java</option>

                        <option>Python</option>

                        <option>Data Science</option>

                        <option>Artificial Intelligence</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>Company</label>

                    <select
                        name="company"
                        onChange={handleChange}
                    >

                        <option>Google</option>

                        <option>Amazon</option>

                        <option>Microsoft</option>

                        <option>Zoho</option>

                        <option>TCS</option>

                        <option>Infosys</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>Job Role</label>

                    <input
                        type="text"
                        name="role"
                        placeholder="Frontend Developer"
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Difficulty</label>

                    <select
                        name="difficulty"
                        onChange={handleChange}
                    >

                        <option>Easy</option>

                        <option>Medium</option>

                        <option>Hard</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>Experience</label>

                    <select
                        name="experience"
                        onChange={handleChange}
                    >

                        <option>Fresher</option>

                        <option>1 Year</option>

                        <option>2 Years</option>

                        <option>3+ Years</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>Questions</label>

                    <select
                        name="questions"
                        onChange={handleChange}
                    >

                        <option>5</option>

                        <option>10</option>

                        <option>15</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>Language</label>

                    <select
                        name="language"
                        onChange={handleChange}
                    >

                        <option>English</option>

                        <option>Tamil</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>Interview Type</label>

                    <select
                        name="interviewType"
                        onChange={handleChange}
                    >

                        <option>Voice</option>

                        <option>Text</option>

                    </select>

                </div>

                <button
                    className="start-button"
                    onClick={startInterview}
                >

                    Start Interview

                </button>

            </div>

        </div>

    );

}

export default InterviewSetup;