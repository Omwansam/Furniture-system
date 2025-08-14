import React, { useState } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Header.css'

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, user } = useAuth();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    window.location.href = '/admin';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="search-input"
          />
        </div>

        <div className="actions">
          <button className="icon-button">
            <FaBell className="icon" />
          </button>

          <div className="avatar-dropdown">
            <button className="avatar-button" onClick={toggleDropdown}>
              <img
                src="/placeholder.svg"
                alt="Admin"
                className="avatar-image"
              />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu" onMouseLeave={closeDropdown}>
                <div className="dropdown-header">
                  <p className="name">{user?.username || 'Admin User'}</p>
                  <p className="email">{user?.email || 'admin@furniture.com'}</p>
                </div>
                <hr />
                <ul className="dropdown-list">
                  <li><Link to="/admin/settings" onClick={closeDropdown}>Settings</Link></li>
                  <li><button onClick={handleLogout} className="link-like">Log out</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

