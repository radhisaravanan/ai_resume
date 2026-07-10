import "../assets/css/about.css";

function About() {
    return (

        <section className="about" id="about">

            <div className="about-left">

                <img
                    src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=700"
                    alt="AI Technology"
                />

            </div>

            <div className="about-right">

                <span className="about-tag">
                    About Our Platform
                </span>

                <h2>
                    Prepare for Interviews with Artificial Intelligence
                </h2>

                <p>
                    AI Voice Interview Assistant is an intelligent interview
                    preparation platform that helps candidates improve their
                    technical and communication skills through AI-driven mock
                    interviews.
                </p>

                <p>
                    The system analyzes your resume, generates personalized
                    interview questions, evaluates your responses, and provides
                    instant feedback to improve your confidence before real
                    interviews.
                </p>

                <div className="about-boxes">

                    <div className="about-box">

                        <h3>Resume Based</h3>

                        <p>
                            Questions are generated from your uploaded resume.
                        </p>

                    </div>

                    <div className="about-box">

                        <h3>AI Evaluation</h3>

                        <p>
                            AI evaluates confidence, communication, and technical skills.
                        </p>

                    </div>

                </div>

            </div>

        </section>

    );
}

export default About;