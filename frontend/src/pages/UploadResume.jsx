import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaCloudUploadAlt,
    FaFilePdf
} from "react-icons/fa";

import "../assets/css/upload.css";


function UploadResume() {


    const navigate = useNavigate();


    const [department, setDepartment] = useState("");

    const [role, setRole] = useState("");

    const [file, setFile] = useState(null);



    const handleFile = (e)=>{

        setFile(e.target.files[0]);

    };





    const handleUpload = ()=>{


        if(!department){

            alert("Please select department");

            return;

        }



        if(!role){

            alert("Please select job role");

            return;

        }



        if(!file){

            alert("Please select your resume");

            return;

        }



        navigate("/resume-analysis",{

            state:{

                department:department,

                role:role,

                resume:file

            }

        });


    };






    return (

        <div className="upload-page">


            <div className="upload-card">


                <FaCloudUploadAlt className="upload-icon"/>


                <h1>
                    Upload Your Resume
                </h1>


                <p>
                    Select your department and role before uploading resume.
                </p>




                {/* Department */}

                <label>
                    Department
                </label>


                <select

                    value={department}

                    onChange={(e)=>setDepartment(e.target.value)}

                >

                    <option value="">
                        Select Department
                    </option>

                    <option>
                        Computer Science
                    </option>

                    <option>
                        Information Technology
                    </option>

                    <option>
                        Electronics
                    </option>

                    <option>
                        Mechanical
                    </option>

                    <option>
                        Civil
                    </option>


                </select>






                {/* Role */}

                <label>
                    Job Role
                </label>


                <select

                    value={role}

                    onChange={(e)=>setRole(e.target.value)}

                >

                    <option value="">
                        Select Role
                    </option>

                    <option>
                        Frontend Developer
                    </option>

                    <option>
                        Backend Developer
                    </option>

                    <option>
                        Full Stack Developer
                    </option>

                    <option>
                        Java Developer
                    </option>

                    <option>
                        Python Developer
                    </option>

                    <option>
                        Data Scientist
                    </option>


                </select>







                {/* Resume Upload */}

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