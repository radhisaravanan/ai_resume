import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../assets/css/register.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    regno: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "regno") {
      if (value === "" || /^\d+$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!/^\d+$/.test(form.regno.trim())) {
      setErrorMsg("Only numbers are allowed in Register Number!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", {
        regno: form.regno.trim(),
        password: form.password,
      });

      if (data.success) {
        alert("Registration complete! Switching to login screen.");
        navigate("/login");
      } else {
        setErrorMsg(data.message || "Registration failure.");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || error.message || "Registration Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="register-card"
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
          Create Account
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
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div>
            <label style={{ color: "#cbd5e1", fontSize: "12px" }}>
              Register Number
            </label>
            <input
              type="text"
              name="regno"
              autoComplete="username"
              value={form.regno}
              onChange={handleChange}
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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ color: "#cbd5e1", fontSize: "12px" }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
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
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginTop: "16px",
            fontSize: "13px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Login
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

export default Register;
