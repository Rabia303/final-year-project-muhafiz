import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiAlertTriangle, FiMap, FiBookmark,
  FiBook, FiInfo, FiMail, FiMoon, FiSun
} from 'react-icons/fi';
import {
  FaFire, FaUserSecret, FaCarSide, FaHouseUser,
  FaLightbulb, FaArchive
} from 'react-icons/fa';
import { getStoredUser } from '../utils/authUtils';
import "../sidebar.css";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('home');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState({});
  const location = useLocation();

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
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

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setActiveItem(path || 'home');
  }, [location]);

  const routeMap = {
    home: '/', discussions: '/discussion', map: '/saferoute', saved: '/reports',
    threats: '/discussion/threats', suspicious: '/discussion/suspicious', traffic: '/discussion/traffic',
    neighborhood: '/discussion/neighborhood', tips: '/discussion/tips', resolved: '/discussion/resolved',
    guidelines: '/resources/guidelines', legal: '/resources/legal', support: '/resources/support'
  };

  const mainMenu = [
    { id: 'home', icon: <FiHome />, label: 'Home' },
    { id: 'discussions', icon: <FiAlertTriangle />, label: 'Discussions' },
    { id: 'map', icon: <FiMap />, label: 'SafeRoute' },
    { id: 'saved', icon: <FiBookmark />, label: 'Safety Reports' }
  ];

  const discussionCategories = [
    { id: 'threats', icon: <FaFire />, label: 'Active Threats' },
    { id: 'suspicious', icon: <FaUserSecret />, label: 'Suspicious Activity' },
    { id: 'traffic', icon: <FaCarSide />, label: 'Traffic Incidents' },
    { id: 'neighborhood', icon: <FaHouseUser />, label: 'Neighborhood Watch' },
    { id: 'tips', icon: <FaLightbulb />, label: 'Safety Tips' },
    { id: 'resolved', icon: <FaArchive />, label: 'Resolved Cases' }
  ];

  const resources = [
    { id: 'guidelines', icon: <FiBook />, label: 'Reporting Guidelines' },
    { id: 'legal', icon: <FiInfo />, label: 'Legal Advice' },
    { id: 'support', icon: <FiMail />, label: 'Support Services' }
  ];

  return (
    <aside className="sidebar">
      {/* Sidebar header */}
      <div className="sidebar-header" style={{ padding: '16px' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="logo-icon" role="img" aria-label="shield icon">🛡️</span>
          <span className="logo-text" style={{ fontWeight: 'bold', fontSize: '18px' }}>Muhafiz</span>

          <button onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode" className="dark-mode-toggle" style={{ marginLeft: 'auto' }}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="main-nav">
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {mainMenu.map(item => (
            <li key={item.id} className={`nav-item ${activeItem === item.id ? 'active' : ''}`} style={{
              display: 'flex', alignItems: 'center', padding: '10px 16px', cursor: 'pointer'
            }}>
              <Link
                to={routeMap[item.id]}
                onClick={() => setActiveItem(item.id)}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <div className="nav-icon" style={{ marginRight: '10px' }}>{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Discussion Categories */}
      <div className="discussion-categories" style={{ marginTop: '20px' }}>
        <h4 className="section-title" style={{ fontSize: '1.2rem', fontWeight: 'bold', padding: '0 16px' }}>DISCUSSIONS</h4>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {discussionCategories.map(item => (
            <li key={item.id} className={`nav-item ${activeItem === item.id ? 'active' : ''}`} style={{
              display: 'flex', alignItems: 'center', padding: '10px 16px', cursor: 'pointer'
            }}>
              <Link
                to={routeMap[item.id]}
                onClick={() => setActiveItem(item.id)}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <div className="nav-icon" style={{ marginRight: '10px' }}>{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      <div className="resources" style={{ marginTop: '20px' }}>
        <h6 className="section-title" style={{ fontSize: '1.2rem', fontWeight: 'bold', padding: '0 16px' }}>RESOURCES</h6>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {resources.map(item => (
            <li key={item.id} className="resource-item" style={{
              display: 'flex', alignItems: 'center', padding: '10px 16px', cursor: 'pointer'
            }}>
              <Link
                to={routeMap[item.id]}
                onClick={() => setActiveItem(item.id)}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <div className="resource-icon" style={{ marginRight: '10px' }}>{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User Info */}
      {user && user.name && (
        <div className="user-card" style={{ padding: '16px', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="user-avatar" style={{
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}>
            <span>{user.name.charAt(0)}</span>
          </div>
          <div className="user-info">
            <strong>{user.name}</strong>
            <div className="user-role" style={{ fontSize: '12px', color: '#666' }}>Community Member</div>
          </div>
        </div>
      )}
    </aside>
  );
}
