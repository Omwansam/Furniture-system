
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaBox, FaShoppingCart, FaUsers,
  FaWarehouse, FaUserCog, FaChartBar, FaCouch, FaTruck, FaCog
} from 'react-icons/fa';
import './Sidebar.css';

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
  { id: 'products', label: 'Products', icon: <FaBox /> },
  { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
  { id: 'customers', label: 'Customers', icon: <FaUsers /> },
  { id: 'inventory', label: 'Inventory', icon: <FaWarehouse /> },
  { id: 'suppliers', label: 'Suppliers', icon: <FaTruck /> },
  { id: 'users', label: 'User Management', icon: <FaUserCog /> },
  { id: 'reports', label: 'Reports', icon: <FaChartBar /> },
  { id: 'settings', label: 'Settings', icon: <FaCog /> },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FaCouch className="sidebar-logo" />
        <h1 className="sidebar-title">FurniAdmin</h1>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.id}
            className={({ isActive }) => `sidebar-button ${isActive ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
