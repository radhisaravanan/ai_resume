import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const sanitizedReg = regNo.trim();

    // ⛔ Rule Verification Check: Pure numeric numbers restriction loop logic validation
    if (!/^\d+$/.test(sanitizedReg)) {
      setErrorMsg(
        "Invalid Formatting! Only numbers (0-9) are allowed in the Register Number field.",
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno: sanitizedReg, password: password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert(
          "Registration structural validation complete! Switch to login window.",
        );
        navigate("/login");
      } else {
        setErrorMsg(
          data.message || "Registration trace error validation execution.",
        );
      }
    } catch (err) {
      setErrorMsg(
        "Network execution down. Verify that the backend port server is running context.",
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "sans-serif",
      }}
    >
      <form
        onSubmit={handleRegisterSubmit}
        autoComplete="off"
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "420px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1e293b",
            marginBottom: "24px",
          }}
        >
          Register Account
        </h2>

        {errorMsg && (
          <div
            style={{
              backgroundColor: "#ffeeef",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "16px",
              textAlign: "center",
              border: "1px solid #fecaca",
            }}
          >
            {errorMsg}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              color: "#334155",
              marginBottom: "8px",
            }}
          >
            Register Number (Numbers Only)
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*" // ✅ Force mobile triggers to load pure dial number numeric pads layout structures
            autoComplete="new-username" // ✅ Bypasses and overrides default browser cached template email auto-fills
            placeholder="Enter Numeric ID (e.g., 20261104)"
            value={regNo}
            onChange={(e) => {
              const val = e.target.value;
              // Block keyboard letters dynamic entries locally at state rendering level
              if (val === "" || /^\d+$/.test(val)) {
                setRegNo(val);
              }
            }}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              color: "#334155",
              marginBottom: "8px",
            }}
          >
            Create Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Min characters secure credential..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#64748b",
            marginTop: "20px",
          }}
        >
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
