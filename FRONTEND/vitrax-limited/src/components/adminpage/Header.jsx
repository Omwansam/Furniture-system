import React, { useState } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import { Link } from "react-router-dom";
import './Header.css'

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

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
                  <p className="name">Admin User</p>
                  <p className="email">admin@furniture.com</p>
                </div>
                <hr />
                <ul className="dropdown-list">
                  <li><Link to="/profile" onClick={closeDropdown}>Profile</Link></li>
                  <li><Link to="/settings" onClick={closeDropdown}>Settings</Link></li>
                  <li><Link to="/support" onClick={closeDropdown}>Support</Link></li>
                  <hr />
                  <li><Link to="/logout" onClick={closeDropdown}>Log out</Link></li>
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

