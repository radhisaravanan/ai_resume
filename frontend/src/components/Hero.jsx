import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div style={heroContainerStyle} className="hero-background-class">
      {/* 🏙️ Dark overlay to make your background image blend smoothly without breaking text readability */}
      <div style={overlayStyle} />

      <div style={contentWrapperStyle}>
        {/* 📢 Left Content Section */}
        <div style={leftSectionStyle}>
          <span style={badgeStyle}>🚀 Welcome to MZORA AI</span>
          <h1 style={mainTitleStyle}>
            Crack Your Dream Job with AI Voice Interview Assistant
          </h1>
          <p style={descStyle}>
            Master every interview with AI. Get real-time technical accuracy analysis, vocabulary tracking, and comprehensive communication fluency feedback.
          </p>
          
          {/* 🔘 Your Original Action Buttons */}
          <div style={btnRowStyle}>
            <button onClick={() => navigate("/register")} style={primaryBtnStyle}>
              Get Started →
            </button>
            <button onClick={() => navigate("/login")} style={secondaryBtnStyle}>
              Login
            </button>
          </div>

          {/* 📊 Your Original Stats Content (Fully Balanced & Aligned) */}
          <div style={statsGridStyle}>
            <div style={statBoxStyle}>
              <div style={statNumStyle}>5000+</div>
              <div style={statLabelStyle}>Students</div>
            </div>
            <div style={statBoxStyle}>
              <div style={statNumStyle}>98%</div>
              <div style={statLabelStyle}>Accuracy</div>
            </div>
            <div style={statBoxStyle}>
              <div style={statNumStyle}>24/7</div>
              <div style={statLabelStyle}>AI Support</div>
            </div>
          </div>
        </div>

        {/* 🔍 Right Empty Block to balance the layout and keep the background campus visible */}
        <div style={rightSectionStyle}></div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DESIGN SYSTEM STYLES (Clean, Overlay Protected & Mobile Fluid)
// ─────────────────────────────────────────────────────────────
const heroContainerStyle = {
  position: "relative",
  minHeight: "calc(100vh - 70px)", // Fits perfectly below your Navbar
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  boxSizing: "border-box",
  fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
  overflow: "hidden",
  /* 
    If your background image path was loaded inline, you can add it back here:
    backgroundImage: "url('/your-original-campus-image.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  */
};

const overlayStyle = {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(15, 23, 42, 0.55)", // Blends the sky/building background so white text pops out beautifully
  zIndex: 1
};

const contentWrapperStyle = {
  position: "relative",
  zIndex: 2,
  maxWidth: "1200px",
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "40px",
  alignItems: "center"
};

const leftSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px"
};

const rightSectionStyle = {
  display: "flex"
};

const badgeStyle = {
  alignSelf: "flex-start",
  backgroundColor: "rgba(59, 130, 246, 0.2)",
  color: "#60a5fa",
  border: "1px solid rgba(59, 130, 246, 0.4)",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.03em"
};

const mainTitleStyle = {
  fontSize: "clamp(34px, 4.5vw, 52px)",
  fontWeight: "900",
  color: "#ffffff",
  lineHeight: "1.15",
  margin: 0,
  letterSpacing: "-0.5px"
};

const descStyle = {
  fontSize: "clamp(15px, 1.8vw, 16px)",
  color: "#e2e8f0",
  lineHeight: "1.65",
  margin: 0,
  maxWidth: "540px"
};

const btnRowStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  marginTop: "8px"
};

const primaryBtnStyle = {
  padding: "14px 32px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
  transition: "transform 0.2s"
};

const secondaryBtnStyle = {
  padding: "14px 32px",
  backgroundColor: "transparent",
  color: "#ffffff",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s"
};

const statsGridStyle = {
  display: "flex",
  gap: "40px",
  marginTop: "20px",
  borderTop: "1px solid rgba(255,255,255,0.15)",
  paddingTop: "24px",
  flexWrap: "wrap"
};

const statBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

const statNumStyle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#38bdf8",
  lineHeight: 1
};

const statLabelStyle = {
  fontSize: "14px",
  color: "#cbd5e1",
  fontWeight: "500"
};

export default Hero;