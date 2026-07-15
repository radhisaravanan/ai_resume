import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaUser,
  FaRobot,
  FaHistory,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "../assets/css/sidebar.css";

function Sidebar() {
  const location = useLocation();

  const [open, setOpen] = useState(true);

  const menu = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <FaUser />,
    },
    {
      title: "Interview",
      path: "/setup",
      icon: <FaRobot />,
    },
    {
      title: "History",
      path: "/history",
      icon: <FaHistory />,
    },
    {
      title: "Report",
      path: "/report",
      icon: <FaChartBar />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <>
      {/* Toggle Button */}

      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}

      <aside className={open ? "sidebar open" : "sidebar"}>

        <div className="sidebar-logo">

          <div className="logo-circle">🤖</div>

          {open && (
            <div>
              <h2>AI Interview</h2>
              <p>Placement Portal</p>
            </div>
          )}

        </div>

        <nav className="sidebar-menu">

          {menu.map((item) => (

            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "menu-item active"
                  : "menu-item"
              }
            >
              <span className="menu-icon">
                {item.icon}
              </span>

              {open && (
                <span className="menu-text">
                  {item.title}
                </span>
              )}
            </Link>

          ))}

        </nav>

        <Link to="/" className="logout-btn">

          <FaSignOutAlt />

          {open && <span>Logout</span>}

        </Link>

      </aside>
    </>
  );
}

export default Sidebar;