import { Link } from "react-router-dom";
import { FaRobot, FaArrowRight, FaSignInAlt } from "react-icons/fa";
import "../assets/css/hero.css";

function Hero() {
  return (
    <section className="hero">


      <div className="hero-content">

        {/* Left Content */}

        <div className="hero-left">

          

          <h1>
            Crack Your Dream Job
            <br />
            <span>with AI Voice Interview Assistant</span>
          </h1>

          

          <div className="hero-buttons">

            <Link
              to="/register"
              className="btn-primary"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="btn-secondary"
            >
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

        {/* Right Content */}

        <div className="hero-right">

          <img
            src="/images/ai-interview.png"
            alt="AI Interview"
          />

        </div>

      </div>

=======
      <div className="hero-content">

        {/* Badge */}
        

        {/* Hero Content */}
        <div className="hero-left">

          <h1>
            Welcome to <span>MZORA AI</span>
            <br />
            Master Every Interview with AI
          </h1>

        

          {/* Buttons */}
          <div className="hero-buttons">

            <Link to="/register" className="btn-primary">
              Get Started <FaArrowRight />
            </Link>

            <Link to="/login" className="btn-secondary">
              <FaSignInAlt /> Login
            </Link>

          </div>

      

          

        </div>

      </div> 
    </section>
  );
}

export default Hero;