import { Link } from "react-router-dom";
import {
    FaMicrophone,
    FaHistory,
    FaUserCircle,
    FaChartBar
} from "react-icons/fa";

import "../assets/css/dashboard.css";

function Dashboard() {

    const interviews = [
        {
            interview: "React Developer",
            date: "10 Jul 2026",
            score: "92%",
            status: "Completed"
        },
        {
            interview: "Java Developer",
            date: "08 Jul 2026",
            score: "88%",
            status: "Completed"
        },
        {
            interview: "PHP Developer",
            date: "05 Jul 2026",
            score: "85%",
            status: "Completed"
        }
    ];

    return (

        <div className="dashboard">

            {/* Header */}

            <div className="dashboard-header">

                <div>

                    <h1>Welcome 👋</h1>

                    <p>
                        Prepare yourself with AI-powered interviews.
                    </p>

                </div>

                <button className="logout-btn">

                    Logout

                </button>

            </div>

            {/* Dashboard Cards */}

            <div className="dashboard-cards">

                {/* Start Interview */}

                <Link
                    to="/interview-setup"
                    className="card"
                >

                    <FaMicrophone className="card-icon" />

                    <h3>Start New Interview</h3>

                    <p>

                        Select your department, role and interview preferences.

                    </p>

                </Link>

                {/* History */}

                <Link
                    to="/history"
                    className="card"
                >

                    <FaHistory className="card-icon" />

                    <h3>Interview History</h3>

                    <p>

                        View your previous interview reports.

                    </p>

                </Link>

                {/* Profile */}

                <Link
                    to="/profile"
                    className="card"
                >

                    <FaUserCircle className="card-icon" />

                    <h3>Profile</h3>

                    <p>

                        Update your personal information.

                    </p>

                </Link>

                {/* Analytics */}

                <Link
                    to="/analytics"
                    className="card"
                >

                    <FaChartBar className="card-icon" />

                    <h3>Performance Analytics</h3>

                    <p>

                        Track your interview scores and progress.

                    </p>

                </Link>

            </div>

            {/* Recent Interviews */}

            <div className="recent">

                <h2>

                    Recent Interviews

                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>Interview</th>

                            <th>Date</th>

                            <th>Score</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            interviews.map((item, index) => (

                                <tr key={index}>

                                    <td>{item.interview}</td>

                                    <td>{item.date}</td>

                                    <td>{item.score}</td>

                                    <td>

                                        <span className="status">

                                            {item.status}

                                        </span>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Dashboard;