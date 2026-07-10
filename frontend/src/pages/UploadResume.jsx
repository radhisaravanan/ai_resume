import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";
import "../assets/css/upload.css";

function UploadResume() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);

    const handleFile = (e) => {

        setFile(e.target.files[0]);

    };

    const handleUpload = () => {

        if (!file) {

            alert("Please select your resume.");

            return;

        }

        // Backend Upload will be added later

        navigate("/resume-analysis");

    };

    return (

        <div className="upload-page">

            <div className="upload-card">

                <FaCloudUploadAlt className="upload-icon"/>

                <h1>Upload Your Resume</h1>

                <p>

                    Upload your resume to allow our AI
                    to generate personalized interview questions.

                </p>

                <label className="upload-box">

                    <FaFilePdf className="pdf-icon"/>

                    {
                        file
                        ?

                        file.name

                        :

                        "Choose Resume (PDF / DOC / DOCX)"

                    }

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFile}
                        hidden
                    />

                </label>

                <button
                    className="upload-btn"
                    onClick={handleUpload}
                >

                    Upload Resume

                </button>

            </div>

        </div>

    );

}

export default UploadResume;