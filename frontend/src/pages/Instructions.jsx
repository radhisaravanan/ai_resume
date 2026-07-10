import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/instructions.css";

function Instructions() {

    const navigate = useNavigate();

    const [agree, setAgree] = useState(false);

    const startInterview = () => {

        if (!agree) {

            alert("Please accept the instructions.");

            return;
        }

        navigate("/interview");

    };

    return (

        <div className="instructions-page">

            <div className="instructions-card">

                <h1>🤖 AI Interview Instructions</h1>

                <p className="subtitle">
                    Please read the following instructions carefully before starting.
                </p>

                <div className="instruction-list">

                    <div className="instruction-item">
                        🎤 Allow microphone access.
                    </div>

                    <div className="instruction-item">
                        🌐 Ensure you have a stable internet connection.
                    </div>

                    <div className="instruction-item">
                        🪑 Sit in a quiet environment.
                    </div>

                    <div className="instruction-item">
                        ⏱ Interview duration: 20 Minutes.
                    </div>

                    <div className="instruction-item">
                        🤖 AI will ask questions based on your resume.
                    </div>

                    <div className="instruction-item">
                        💬 You can answer using voice or text.
                    </div>

                    <div className="instruction-item">
                        🚫 Do not refresh or close the browser during the interview.
                    </div>

                </div>

                <div className="checkbox">

                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e)=>setAgree(e.target.checked)}
                    />

                    <span>
                        I have read and understood the instructions.
                    </span>

                </div>

                <button
                    className="start-btn"
                    onClick={startInterview}
                >

                    Start Interview

                </button>

            </div>

        </div>

    );

}

export default Instructions;