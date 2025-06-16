import React from 'react'
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css'
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaChartBar, FaCog } from 'react-icons/fa';


const AdminSidebar = () => {
  return (
    <nav className="admin-sidebar">
      <ul>
        <li>
          <NavLink to="/admin" end>
            <FaTachometerAlt className="sidebar-icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products">
            <FaBoxOpen className="sidebar-icon" /> Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/orders">
            <FaShoppingCart className="sidebar-icon" /> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/customers">
            <FaUsers className="sidebar-icon" /> Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/analytics">
            <FaChartBar className="sidebar-icon" /> Analytics
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/settings">
            <FaCog className="sidebar-icon" /> Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default AdminSidebar
