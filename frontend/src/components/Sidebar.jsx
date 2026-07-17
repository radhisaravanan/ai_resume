import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaRobot,
  FaHistory,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "../assets/css/sidebar.css";
import collegeLogo from "../assets/images/mountzion-logo.png";

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay */}
      {showSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Hamburger Button */}
      <button className="menu-toggle" onClick={() => setShowSidebar(true)}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? "show" : ""}`}>
        {/* Close Button */}
        <button
          className={`menu-toggle ${showSidebar ? "hide" : ""}`}
          onClick={() => setShowSidebar(true)}
        >
          <FaBars />
        </button>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-circle">
            <img
              src={collegeLogo}
              alt="College Logo"
              className="college-logo"
            />
          </div>

          <div className="logo-text">
            <h2>MZORA AI</h2>
            <p>Interview Platform</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaUser />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/interview/1"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaRobot />
            <span>AI Interview</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaHistory />
            <span>History</span>
          </NavLink>

          <NavLink
            to="/report"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaChartBar />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaCog />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={logout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
