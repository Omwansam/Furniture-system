import React from 'react';
import { FaBell } from 'react-icons/fa';
import './AdminHeader.css';

const AdminHeader = () => {
  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing session or redirecting
    alert('Logged out successfully!');
    // In a real app, you could also use something like:
    // window.location.href = '/login'; or 
    // history.push('/login'); for navigation
  };

  return (
    <header className='admin-header'>
      <div className='admin-header-left'>
        <h1>Vitrax Furniture Admin Dashboard</h1>
      </div>

      <div className='admin-search-bar'>
        <input type='text' placeholder='Search Dashboard.....' />
      </div>

      <div className='admin-header-right'>
        <div className="admin-icon notifications">
          <FaBell />
        </div>
        <div className="admin-profile">
          <span className="admin-name">Admin User</span>
          <div className="profile-circle">A</div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

