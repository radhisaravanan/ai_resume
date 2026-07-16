import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightToBracket, FaUserGraduate } from "react-icons/fa6";
import API from "../services/api";
import "../assets/css/login.css";

function Login() {
  const navigate = useNavigate();

  const [regno, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        regno,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        alert(response.data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login connection error:", error);

      alert(
        error.response?.data?.message ||
          "Cannot connect to the server. Please check if your MySQL database and backend server are running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>
              <FaUserGraduate className="header-icon" />
              Student Login
            </h2>
           
          </div>

          <form onSubmit={handleLogin}>
            <label>Register Number</label>
            <input
              type="text"
              placeholder="Enter Register Number"
              value={regno}
              onChange={(e) => setRegno(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              <FaArrowRightToBracket />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;