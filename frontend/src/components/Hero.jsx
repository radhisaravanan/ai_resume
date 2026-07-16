import { Link } from "react-router-dom";
import { FaRobot, FaArrowRight, FaSignInAlt } from "react-icons/fa";
import "../assets/css/hero.css";

function Hero() {
  return (
    <section className="hero">
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