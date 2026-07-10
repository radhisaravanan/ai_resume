import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/analysis.css";

function ResumeAnalysis() {

    const navigate = useNavigate();

    const [step, setStep] = useState(0);

    const steps = [
        "Extracting Personal Information...",
        "Detecting Technical Skills...",
        "Finding Projects...",
        "Analyzing Experience...",
        "Preparing Interview Questions...",
        "Analysis Completed Successfully!"
    ];

    useEffect(() => {

        if (step < steps.length - 1) {

            const timer = setTimeout(() => {

                setStep(step + 1);

            }, 1500);

            return () => clearTimeout(timer);

        }
        else {

            const timer = setTimeout(() => {

                navigate("/instructions");

            }, 2000);

            return () => clearTimeout(timer);

        }

    }, [step]);

    return (

        <div className="analysis-page">

            <div className="analysis-card">

                <h1>🤖 AI Resume Analyzer</h1>

                <p>

                    Please wait while our AI analyzes your resume.

                </p>

                <div className="loader"></div>

                <div className="steps">

                    {
                        steps.map((item, index) => (

                            <div
                                key={index}
                                className={
                                    index <= step
                                    ?
                                    "active-step"
                                    :
                                    "inactive-step"
                                }
                            >

                                {
                                    index < step
                                    ?
                                    "✅ "
                                    :
                                    index === step
                                    ?
                                    "⏳ "
                                    :
                                    "⚪ "
                                }

                                {item}

                            </div>

                        ))
                    }

                </div>

            </div>

        </div>

    );

}

export default ResumeAnalysis;