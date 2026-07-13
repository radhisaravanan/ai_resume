import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaFilePdf,
  FaUpload,
  FaCheckCircle,
  FaChartPie,
  FaBrain,
  FaArrowRight,
} from "react-icons/fa";

import "../assets/css/resumeAnalyzer.css";


function ResumeAnalyzer() {


  const navigate = useNavigate();



  const [file, setFile] = useState(null);


  const [result, setResult] = useState(null);





  const analyzeResume = () => {



    if (!file) {

      alert("Please upload your resume.");

      return;

    }





    // Dummy AI Analysis Result

    const analysis = {


      fileName: file.name,


      ats: 87,


      match: 91,



      skills: [

        "React",

        "Java",

        "Python",

        "Node.js",

        "MySQL"

      ],




      suggestions: [

        "Add more project descriptions.",

        "Mention internship experience.",

        "Improve achievements section.",

        "Use more ATS keywords."

      ]


    };



    setResult(analysis);



  };







 const continueSetup = () => {

    navigate("/interview", {

        state: {

            resume: file,

            analysis: result

        }

    });

};








  return (


    <div className="resume-page">



      <div className="resume-card">





        <h1>


          <FaBrain />


          AI Resume Analyzer


        </h1>





        <p>

          Upload your resume and get AI feedback instantly.

        </p>








        <div className="upload-box">



          <FaFilePdf className="pdf-icon" />





          <input


            type="file"


            accept=".pdf,.doc,.docx"


            onChange={(e)=>setFile(e.target.files[0])}


          />



        </div>








        {
          file &&

          <p>

            Selected Resume : {file.name}

          </p>

        }








        <button


          className="analyze-btn"


          onClick={analyzeResume}


        >



          <FaUpload />


          Analyze Resume



        </button>









        {


          result &&



          <>





            <div className="score-section">





              <div className="score-card">



                <FaChartPie />



                <h2>

                  {result.ats}%

                </h2>



                <p>

                  ATS Score

                </p>



              </div>









              <div className="score-card">



                <FaCheckCircle />



                <h2>

                  {result.match}%

                </h2>



                <p>

                  Resume Match

                </p>



              </div>





            </div>









            <div className="skills">



              <h2>

                Extracted Skills

              </h2>





              {


                result.skills.map((skill,index)=>(



                  <span key={index}>



                    {skill}



                  </span>



                ))



              }





            </div>









            <div className="suggestions">



              <h2>

                AI Suggestions

              </h2>






              <ul>



                {


                  result.suggestions.map((item,index)=>(



                    <li key={index}>


                      {item}


                    </li>



                  ))



                }



              </ul>




            </div>









           <button

 className="start-button"

 onClick={continueSetup}

>

 Continue To Interview

 <FaArrowRight />

</button>







          </>



        }





      </div>



    </div>



  );



}



export default ResumeAnalyzer;