import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../assets/css/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    regno: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", {
        regno: credentials.regno.trim(),
        password: credentials.password,
      });
      console.log("Login Response:", data);

      if (data.success) {
        console.log("Login successful");

        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("highest_stage", "5");

        console.log("Navigating to dashboard...");
        navigate("/dashboard");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Login authentication failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="login-card"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "30px 40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "460px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}
        >
          Welcome Back
        </h2>
        {errorMsg && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#fca5a5",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {errorMsg}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label style={{ color: "#cbd5e1", fontSize: "12px" }}>
              Register Number
            </label>
            <input
              type="text"
              name="regno"
              value={credentials.regno}
              onChange={handleChange}
              autoComplete="new-variable-regno"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ color: "#cbd5e1", fontSize: "12px" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              marginTop: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginTop: "20px",
            fontSize: "13px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: "8px",
  color: "#fff",
  marginTop: "4px",
  boxSizing: "border-box",
};

export default Login;
