import Sidebar from "../components/Sidebar";
import "../assets/css/dashboard.css";

import {
  FaChartLine,
  FaFileAlt,
  FaRobot,
  FaHistory,
  FaPlay,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";


function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

const startInterview = async () => {

    try {

        const response = await API.post("/interview/start");

        if(response.data.success){

            localStorage.setItem(
                "sessionId",
                response.data.sessionId
            );

            navigate("/setup");

        }

    }
    catch(error){

        console.log(error);

        alert("Unable to start interview");

    }

};

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        {/* Welcome Card */}

        <div className="welcome-card">
          <h1>Welcome {user?.full_name || "Student"} 👋</h1>

          <p>Practice interviews and improve your placement skills with AI.</p>

          <button onClick={startInterview}>
            <FaPlay />
            Start Interview
          </button>
        </div>

        {/* Stats */}

        <div className="stats">
          <div className="card">
            <FaHistory />
            <h2>25</h2>
            <p>Total Interviews</p>
          </div>

          <div className="card">
            <FaChartLine />
            <h2>89%</h2>
            <p>Average Score</p>
          </div>

          <div className="card">
            <FaRobot />
            <h2>92%</h2>
            <p>Placement Ready</p>
          </div>

          <div className="card">
            <FaFileAlt />
            <h2>85%</h2>
            <p>Resume Score</p>
          </div>
        </div>

        {/* Bottom Grid */}

        <div className="dashboard-grid">
          {/* Resume */}

          <div className="dashboard-box">
            <h2>Resume Status</h2>

            <div className="resume-status">
              <p>
                <strong>Resume :</strong> Uploaded ✅
              </p>

              <p>
                <strong>ATS Score :</strong> 85%
              </p>

              <p>
                <strong>Last Updated :</strong> Today
              </p>

              <button className="small-btn">Update Resume</button>
            </div>
          </div>

          {/* Interviews */}

          <div className="dashboard-box">
            <h2>Recent Interviews</h2>

            <table className="recent-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Score</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Google</td>
                  <td>Frontend</td>
                  <td>90%</td>
                </tr>

                <tr>
                  <td>Amazon</td>
                  <td>Node.js</td>
                  <td>84%</td>
                </tr>

                <tr>
                  <td>Infosys</td>
                  <td>React</td>
                  <td>92%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Companies */}

          <div className="dashboard-box">
            <h2>Upcoming Placements</h2>

            <ul className="company-list">
              <li>Google</li>
              <li>Microsoft</li>
              <li>Amazon</li>
              <li>Zoho</li>
              <li>TCS</li>
              <li>Infosys</li>
            </ul>
          </div>

          {/* Suggestions */}

          <div className="dashboard-box">
            <h2>AI Suggestions</h2>

            <ul className="suggestion-list">
              <li>✔ Improve React Concepts</li>

              <li>✔ Practice Node.js</li>

              <li>✔ Improve Communication</li>

              <li>✔ Practice Aptitude</li>

              <li>✔ Build Confidence</li>
            </ul>
          </div>
        </div>

        {/* Analytics */}

        <div className="analytics-grid">
          <div className="analytics-card">
            <h2>Performance Progress</h2>

            <div className="progress-item">
              <span>Technical</span>
              <progress value="90" max="100"></progress>
              <span>90%</span>
            </div>

            <div className="progress-item">
              <span>Communication</span>
              <progress value="80" max="100"></progress>
              <span>80%</span>
            </div>

            <div className="progress-item">
              <span>Confidence</span>
              <progress value="85" max="100"></progress>
              <span>85%</span>
            </div>
          </div>

          <div className="analytics-card">
            <h2>Placement Readiness</h2>

            <div className="circle-score">
              <h1>92%</h1>
            </div>

            <p className="ready-text">
              Keep practicing interviews to improve your placement readiness.
            </p>
          </div>

          <div className="analytics-card">
            <h2>Leaderboard</h2>

            <table className="leaderboard">
              <tbody>
                <tr>
                  <td>🥇 Rahul</td>
                  <td>98%</td>
                </tr>

                <tr>
                  <td>🥈 Priya</td>
                  <td>95%</td>
                </tr>

                <tr>
                  <td>🥉 {user?.full_name || "You"}</td>
                  <td>92%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="analytics-card">
            <h2>Today's Challenge</h2>

            <h3>Explain the Virtual DOM in React.</h3>

            <p>Practice this question before your interview.</p>

            <button className="challenge-btn" onClick={startInterview}>
              Practice Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
