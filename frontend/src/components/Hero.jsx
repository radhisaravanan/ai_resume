import { Link } from "react-router-dom";
import "../assets/css/hero.css";

function Hero() {

    return (

        <section className="hero">

            <div className="hero-content">


                {/* LEFT CONTENT */}

                <div className="hero-left">



<h1>
    Crack Your Dream Job
    <br />
    <span>with AI Voice Interview Assistant</span>
</h1>



                    <div className="hero-buttons">


                        <Link 
                        to="/register"
                        className="btn-primary">

                            Get Started

                        </Link>



                        <Link 
                        to="/login"
                        className="btn-secondary">

                            Login

                        </Link>


                    </div>
                    <div className="hero-stats">

    <div className="stat">
        <h2>5000+</h2>
        <p>Students</p>
    </div>

    <div className="stat">
        <h2>98%</h2>
        <p>Accuracy</p>
    </div>

    <div className="stat">
        <h2>24/7</h2>
        <p>AI Support</p>
    </div>

</div>


                </div>






            </div>


        </section>

    );

}


export default Hero;