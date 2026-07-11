import Sidebar from "../components/Sidebar";
import "../assets/css/dashboard.css";

import {
FaUserGraduate,
FaChartLine,
FaFileAlt,
FaRobot,
FaHistory,
FaPlay
} from "react-icons/fa";

function Dashboard(){

return(

<div className="dashboard">

<Sidebar/>

<div className="dashboard-content">

<div className="welcome-card">

<h1>

Welcome Nagajothi 👋

</h1>

<p>

Practice interviews and improve your placement skills with AI.

</p>

<button>

<FaPlay/>

Start Interview

</button>

</div>

<div className="stats">

<div className="card">

<FaHistory/>

<h2>25</h2>

<p>Total Interviews</p>

</div>

<div className="card">

<FaChartLine/>

<h2>89%</h2>

<p>Average Score</p>

</div>

<div className="card">

<FaRobot/>

<h2>92%</h2>

<p>Placement Ready</p>

</div>

<div className="card">

<FaFileAlt/>

<h2>85%</h2>

<p>Resume Score</p>

</div>

</div>
{/* =========================
    Dashboard Bottom
========================= */}

<div className="dashboard-grid">

    {/* Resume Status */}

    <div className="dashboard-box">

        <h2>Resume Status</h2>

        <div className="resume-status">

            <p><strong>Resume :</strong> Uploaded ✅</p>

            <p><strong>ATS Score :</strong> 85%</p>

            <p><strong>Last Updated :</strong> 10 July 2026</p>

            <button className="small-btn">

                Update Resume

            </button>

        </div>

    </div>


    {/* Recent Interviews */}

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

                    <td>Java Developer</td>

                    <td>84%</td>

                </tr>

                <tr>

                    <td>Infosys</td>

                    <td>React Developer</td>

                    <td>92%</td>

                </tr>

            </tbody>

        </table>

    </div>


    {/* Upcoming Companies */}

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


    {/* AI Suggestions */}

    <div className="dashboard-box">

        <h2>AI Suggestions</h2>

        <ul className="suggestion-list">

            <li>✔ Improve React Concepts</li>

            <li>✔ Practice HR Questions</li>

            <li>✔ Increase Speaking Confidence</li>

            <li>✔ Improve Eye Contact</li>

            <li>✔ Practice Coding Daily</li>

        </ul>

    </div>

</div>
{/* ==========================
    Dashboard Analytics
========================== */}

<div className="analytics-grid">

    {/* Performance Progress */}

    <div className="analytics-card">

        <h2>Performance Progress</h2>

        <div className="progress-item">

            <span>Technical Skills</span>

            <progress value="90" max="100"></progress>

            <span>90%</span>

        </div>

        <div className="progress-item">

            <span>Communication</span>

            <progress value="82" max="100"></progress>

            <span>82%</span>

        </div>

        <div className="progress-item">

            <span>Confidence</span>

            <progress value="88" max="100"></progress>

            <span>88%</span>

        </div>

        <div className="progress-item">

            <span>Grammar</span>

            <progress value="80" max="100"></progress>

            <span>80%</span>

        </div>

    </div>


    {/* Placement Readiness */}

    <div className="analytics-card">

        <h2>Placement Readiness</h2>

        <div className="circle-score">

            <h1>92%</h1>

        </div>

        <p className="ready-text">

            You are almost placement ready.

            Practice communication to reach 100%.

        </p>

    </div>


    {/* Leaderboard */}

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

                    <td>🥉 Nagajothi</td>

                    <td>92%</td>

                </tr>

            </tbody>

        </table>

    </div>


    {/* Daily Challenge */}

    <div className="analytics-card">

        <h2>Today's Challenge</h2>

        <h3>

            Explain the Virtual DOM in React.

        </h3>

        <p>

            Answer this question to improve your technical score.

        </p>

        <button className="challenge-btn">

            Practice Now

        </button>

    </div>

</div>
</div>

</div>

);

}

export default Dashboard;