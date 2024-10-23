import React, { Suspense } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faPlusSquare, faSignOutAlt, faUserCircle, faBell } from '@fortawesome/free-solid-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import './Sidebar.css';
import logo from '../assets/logo.png';

const Sidebar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileImage');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const userProfileImage = localStorage.getItem('profileImage');

  return (
    <Suspense fallback={<div>Loading Sidebar...</div>}>
      {/* Sidebar section */}
      <div className="sidebar">
        <div className="sidebar-logo .hide-on-mobile">
          <img className="logo" src={logo} alt="Instagram" loading="lazy" />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/feed" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FontAwesomeIcon icon={faHome} /> <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/search" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FontAwesomeIcon icon={faSearch} /> <span>Search</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FontAwesomeIcon icon={faPlusSquare} /> <span>Upload</span>
              </NavLink>
            </li>
            <li className="hide-on-mobile">
              <NavLink to="#">
                <FontAwesomeIcon icon={faFacebookMessenger} /> <span>Messages</span>
              </NavLink>
            </li>
            <li className="hide-on-mobile">
              <NavLink to="#">
                <FontAwesomeIcon icon={faBell} /> <span>Notifications</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active-link profile-link' : 'profile-link')}>
                {userProfileImage && userProfileImage !== '' ? (
                  <img src={userProfileImage} alt="Profile" className="profile-image" loading="lazy" />
                ) : (
                  <FontAwesomeIcon icon={faUserCircle} className="fallback-profile-icon" />
                )}
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>
          <button onClick={handleLogout} className="logout-btn hide-on-mobile">
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Top-right section for Messages, Notifications, and Logout */}
      <div className="top-right-container">
        <div className="sidebar-logo">
          <img className="logo" src={logo} alt="Instagram" loading="lazy" />
        </div>
        <button className="top-right-icon">
          <FontAwesomeIcon icon={faFacebookMessenger} /> {/* Messages */}
        </button>
        <button className="top-right-icon">
          <FontAwesomeIcon icon={faBell} /> {/* Notifications */}
        </button>
        <button onClick={handleLogout} className="logout-btn">
          <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
        </button>
      </div>
    </Suspense>
  );
};

export default Sidebar;
