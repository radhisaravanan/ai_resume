import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaPlay
} from "react-icons/fa";

import "../assets/css/interviewSetup.css";


function InterviewSetup() {


    const navigate = useNavigate();

    const location = useLocation();


    // Data coming from ResumeAnalyzer

    const resumeData = location.state;



    const [form, setForm] = useState({


        


        analysis: resumeData?.analysis || null,


        department: "",


        domain: "",


        company: "",


        role: "",

        experience: "",


        questions: "5",


        language: "English",


        


    });







    const handleChange = (e)=>{


        setForm({

            ...form,

            [e.target.name]: e.target.value

        });


    };
const handleResume = (e)=>{

    const file = e.target.files[0];

    if(file){

        setForm({

            ...form,

            resume:file

        });

    }

};






    const startInterview = ()=>{


    if(!form.resume){

        alert("Please upload resume");

        return;

    }


    if(!form.department){

        alert("Please select department");

        return;

    }


    if(!form.role){

        alert("Please enter job role");

        return;

    }



    navigate("/interview",{

        state:form

    });


};








    return(


        <div className="setup-page">


            <div className="setup-card">



                <h1>
                 Smart Interview Setup
                </h1>


                {/* Department */}


                <div className="form-group">


                    <label>
                        Department
                    </label>



                    <select

                        name="department"

                        value={form.department}

                        onChange={handleChange}

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



                    </select>



                </div>


                {/* Domain */}


                <div className="form-group">


                    <label>
                        Domain
                    </label>



                    <select

                        name="domain"

                        value={form.domain}

                        onChange={handleChange}

                    >


                        <option value="">
                            Select Domain
                        </option>


                        <option>
                            Web Development
                        </option>


                        <option>
                            Java
                        </option>


                        <option>
                            Python
                        </option>


                        <option>
                            Data Science
                        </option>


                        <option>
                            Artificial Intelligence
                        </option>



                    </select>


                </div>



                {/* Role */}


                <div className="form-group">


                    <label>
                        Job Role
                    </label>


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


                    <label>
                        Experience
                    </label>


                    <select

                        name="experience"

                        value={form.experience}

                        onChange={handleChange}

                    >


                        <option>
                            Fresher
                        </option>


                        <option>
                            1 Year
                        </option>


                        <option>
                            2 Years
                        </option>


                        <option>
                            3+ Years
                        </option>


                    </select>


                </div>



                {/* Questions */}


                <div className="form-group">


                    <label>
                        Questions
                    </label>


                    <select

                        name="questions"

                        value={form.questions}

                        onChange={handleChange}

                    >


                        <option>
                            5
                        </option>


                        <option>
                            10
                        </option>


                        <option>
                            15
                        </option>


                    </select>


                </div>

                {/* Language */}


                <div className="form-group">


                    <label>
                        Language
                    </label>


                    <select

                        name="language"

                        value={form.language}

                        onChange={handleChange}

                    >


                        <option>
                            English
                        </option>


                        <option>
                            Tamil
                        </option>


                    </select>


                </div>






 {/* Resume Analysis */}


                {

                    form.analysis &&


                    <div className="analysis-box">


                        <h3>
                            Resume Analysis
                        </h3>


                        <p>
                            ATS Score : {form.analysis.ats}%
                        </p>


                        <p>
                            Resume Match : {form.analysis.match}%
                        </p>


                    </div>


                }




{/* Resume Upload */}

<div className="form-group">

<label>
    Resume
</label>


<div className="resume-upload">


<input

type="file"

accept=".pdf,.doc,.docx"

onChange={handleResume}

/>


</div>


{
form.resume &&

<p>
✅ {form.resume.name}
</p>

}


</div>








                <button

                    className="start-button"

                    onClick={startInterview}

                >


                    <FaPlay/>


                    Start Interview


                </button>







            </div>


        </div>


    );



}


export default InterviewSetup;