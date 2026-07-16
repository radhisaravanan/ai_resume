import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const sanitizedReg = regNo.trim();

    if (!/^\d+$/.test(sanitizedReg)) {
      setErrorMsg(
        "Incorrect dynamic entry format. Register Numbers are digits only.",
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno: sanitizedReg, password: password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("regno", data.user.regno);
        navigate("/resume");
      } else {
        setErrorMsg(
          data.message ||
            "Invalid authentication credentials block parameters entry.",
        );
      }
    } catch (err) {
      setErrorMsg("Failed to reach terminal verification setup node.");
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
        onSubmit={handleLoginSubmit}
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
          Candidate Sign In
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
            Register Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="new-username" // ✅ Suppresses any cached context template default emails cache memory traces
            placeholder="Enter Numeric Register ID Only"
            value={regNo}
            onChange={(e) => {
              const val = e.target.value;
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
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Enter Secret Key String"
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
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Verify Credentials
        </button>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#64748b",
            marginTop: "20px",
          }}
        >
          New system instance tracking?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#10b981", cursor: "pointer", fontWeight: "600" }}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
