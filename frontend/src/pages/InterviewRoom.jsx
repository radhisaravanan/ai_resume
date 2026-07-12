import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/interviewRoom.css";

function InterviewRoom() {

    const navigate = useNavigate();

    const videoRef = useRef(null);

    const recognitionRef = useRef(null);

    const questions = [

        "Tell me about yourself.",

        "Why should we hire you?",

        "What are your strengths?",

        "Explain React Hooks.",

        "Where do you see yourself in five years?"

    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [transcript, setTranscript] = useState("");

    const [timer, setTimer] = useState(60);

    useEffect(() => {

        async function startCamera() {

            try {

                const stream = await navigator.mediaDevices.getUserMedia({

                    video: true,

                    audio: true

                });

                videoRef.current.srcObject = stream;

            }

            catch(error){

                console.log(error);

            }

        }

        startCamera();

    }, []);

    useEffect(() => {

        const interval = setInterval(() => {

            setTimer(prev => {

                if(prev === 0){

                    return 0;

                }

                return prev - 1;

            });

        },1000);

        return ()=>clearInterval(interval);

    },[]);

    const startListening = () => {

        const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

        if(!SpeechRecognition){

            alert("Speech Recognition is not supported.");

            return;

        }

        const recognition = new SpeechRecognition();

        recognition.continuous = true;

        recognition.interimResults = true;

        recognition.lang = "en-US";

        recognition.onresult = (event)=>{

            let text="";

            for(let i=0;i<event.results.length;i++){

                text += event.results[i][0].transcript+" ";

            }

            setTranscript(text);

        };

        recognition.start();

        recognitionRef.current = recognition;

    };

    const stopListening=()=>{

        if(recognitionRef.current){

            recognitionRef.current.stop();

        }

    };

    const nextQuestion=()=>{

        stopListening();

        setTranscript("");

        setTimer(60);

        if(currentQuestion<questions.length-1){

            setCurrentQuestion(currentQuestion+1);

        }

        else{

            navigate("/report");

        }

    };

    return(

<div className="interview-page">

<div className="left-panel">

<h2>Live Camera</h2>

<video

ref={videoRef}

autoPlay

playsInline

muted

/>

</div>

<div className="right-panel">

<h2>AI Interview</h2>

<div className="timer">

Time Left : {timer}s

</div>

<div className="question-box">

<h3>

Question {currentQuestion+1}

</h3>

<p>

{questions[currentQuestion]}

</p>

</div>

<div className="answer-box">

<h3>Your Answer</h3>

<textarea

value={transcript}

readOnly

/>

</div>

<div className="buttons">

<button

className="start-btn"

onClick={startListening}

>

Start Speaking

</button>

<button

className="stop-btn"

onClick={stopListening}

>

Stop

</button>

<button

className="next-btn"

onClick={nextQuestion}

>

Next Question

</button>

</div>

</div>

</div>

);

}

export default InterviewRoom;