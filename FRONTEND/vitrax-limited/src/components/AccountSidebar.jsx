import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt,
  FaBox,
  FaDownload,
  FaMapMarkerAlt,
  FaUserCog,
  FaTicketAlt,
  FaHeart,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AccountSidebar.css';

const AccountSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      icon: <FaTachometerAlt />,
      label: 'Dashboard',
      description: 'Account overview'
    },
    {
      path: '/orders',
      icon: <FaBox />,
      label: 'Orders',
      description: 'Order history'
    },
    {
      path: '/downloads',
      icon: <FaDownload />,
      label: 'Downloads',
      description: 'Digital products'
    },
    {
      path: '/addresses',
      icon: <FaMapMarkerAlt />,
      label: 'Addresses',
      description: 'Shipping & billing'
    },
    {
      path: '/account-details',
      icon: <FaUserCog />,
      label: 'Account Details',
      description: 'Profile settings'
    },
    {
      path: '/coupons',
      icon: <FaTicketAlt />,
      label: 'My Coupons',
      description: 'Discount codes'
    },
    {
      path: '/wishlist',
      icon: <FaHeart />,
      label: 'Wishlist',
      description: 'Saved items'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="account-sidebar">
      <div className="sidebar-header">
        <h3>My Account</h3>
        <p>Manage your account</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="sidebar-icon">
              {item.icon}
            </div>
            <div className="sidebar-content">
              <span className="sidebar-label">{item.label}</span>
              <span className="sidebar-description">{item.description}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;
