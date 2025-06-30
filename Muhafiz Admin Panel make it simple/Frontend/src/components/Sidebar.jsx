import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/sidebar.css';

const Sidebar = ({ sidebarOpen }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await axios.get("http://localhost:5002/api/admin-info", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAdminInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch admin info", err);
      }
    };

    fetchAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-logo">
         <span className="logo-icon" role="img" aria-label="shield icon" style={{ fontSize: '34px' }}>🛡️</span>
        {sidebarOpen && <span style={{ fontWeight: 'bold', fontSize: '28px' }}>Muhafiz</span>}
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <i className="fas fa-tachometer-alt"></i>
          {sidebarOpen && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/users" className="nav-item">
          <i className="fas fa-users"></i>
          {sidebarOpen && <span>Manage Users</span>}
        </NavLink>
        <NavLink to="/posts" className="nav-item">
          <i className="fas fa-comments"></i>
          {sidebarOpen && <span>Community Posts</span>}
        </NavLink>
        <NavLink to="/incidents" className="nav-item">
          <i className="fas fa-exclamation-triangle"></i>
          {sidebarOpen && <span>Incidents</span>}
        </NavLink>
        <NavLink to="/areas" className="nav-item">
          <i className="fas fa-map-marked-alt"></i>
          {sidebarOpen && <span>Area Reporting</span>}
        </NavLink>
        <NavLink to="/analytics" className="nav-item">
          <i className="fas fa-chart-bar"></i>
          {sidebarOpen && <span>Analytics</span>}
        </NavLink>
        <NavLink to="/heatmaps" className="nav-item">
          <i className="fas fa-map"></i>
          {sidebarOpen && <span>Heatmaps</span>}
        </NavLink>
        <NavLink to="/reports" className="nav-item">
          <i className="fas fa-map"></i>
          {sidebarOpen && <span>Power Bi Reports</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${adminInfo?.name || 'Admin'}&background=0D8ABC&color=fff`}
              alt="Admin Avatar"
              className="avatar-img"
            />
          </div>
          {sidebarOpen && (
            <div className="user-info">
              <span className="user-name">{adminInfo?.name || "Admin User"}</span>
              <span className="user-role">Admin</span>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
