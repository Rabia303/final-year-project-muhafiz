import React, { useState, useEffect } from 'react';
import {
  FiHome, FiMap, FiActivity, FiFileText, FiMessageCircle,
  FiBookOpen, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiLogIn, FiShield
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/authUtils';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser || null);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="premium-nav">
      <div className="nav-container">
        {/* Left Section - Logo */}
        <div className="nav-left">
          <div className="nav-brand">
            <FiShield className="nav-icon" />
            <Link to="/" className="nav-logo-link">
              <h1>Muhafiz</h1>
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FiHome className="nav-link-icon" />
            <span>Home</span>
          </Link>

          <Link to="/safetyroute" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FiMap className="nav-link-icon" />
            <span>Safety Navigator</span>
          </Link>

          <Link to="/zonemap" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FiActivity className="nav-link-icon" />
            <span>Risk Map</span>
          </Link>

          <Link to="/reports" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FiFileText className="nav-link-icon" />
            <span>Incident Reports</span>
          </Link>

          <Link to="/forum" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FiMessageCircle className="nav-link-icon" />
            <span>Community Hub</span>
          </Link>

          <Link to="/resources" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FiBookOpen className="nav-link-icon" />
            <span>Safety Resources</span>
          </Link>

          {/* Dark Mode + Auth */}
          <div className="nav-actions">
            <button
              className="dark-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle dark mode"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} style={{ color: 'white' }} />}
            </button>

            {!user ? (
              <Link to="/login">
                <button className="nav-signin-btn">
                  <FiLogIn /> Sign In
                </button>
              </Link>
            ) : (
              <div className="user-actions">
                <button className="nav-signin-btn" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                  👋 {user.name?.split(" ")[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
