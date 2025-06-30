import { useState } from 'react';
import '../styles/header.css';

const Header = ({ setSidebarOpen, sidebarOpen }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'New incident reported', time: '10 mins ago', read: false },
    { id: 2, text: '3 new users registered', time: '1 hour ago', read: true },
    { id: 3, text: 'System maintenance scheduled', time: '2 days ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="header-right">
        <div className="notification-icon">
          <button onClick={() => setNotificationsOpen(!notificationsOpen)}>
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          {notificationsOpen && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button className="mark-all-read">Mark all as read</button>
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    <p>{notification.text}</p>
                    <small>{notification.time}</small>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <a href="#">View all notifications</a>
              </div>
            </div>
          )}
        </div>
        <div className="profile-icon">
          <button onClick={() => setProfileOpen(!profileOpen)}>
            <i className="fas fa-user-circle"></i>
          </button>
          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <i className="fas fa-user-circle"></i>
                <div>
                  <h4>Admin User</h4>
                  <small>Super Admin</small>
                </div>
              </div>
              <div className="dropdown-menu">
                <a href="#"><i className="fas fa-user"></i> Profile</a>
                <a href="#"><i className="fas fa-cog"></i> Settings</a>
                <a href="#"><i className="fas fa-sign-out-alt"></i> Logout</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;