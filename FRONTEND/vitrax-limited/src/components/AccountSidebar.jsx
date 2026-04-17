import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaDownload,
  FaMapMarkerAlt,
  FaUserCog,
  FaTicketAlt,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./AccountSidebar.css";

const AccountSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: "/account", icon: <FaTachometerAlt />, label: "Dashboard", description: "Account overview" },
    { path: "/account/orders", icon: <FaBox />, label: "Orders", description: "Order history" },
    { path: "/account/downloads", icon: <FaDownload />, label: "Downloads", description: "Digital products" },
    { path: "/account/addresses", icon: <FaMapMarkerAlt />, label: "Addresses", description: "Shipping & billing" },
    { path: "/account/settings", icon: <FaUserCog />, label: "Settings", description: "Profile & security" },
    { path: "/account/coupons", icon: <FaTicketAlt />, label: "My Coupons", description: "Discount codes" },
    { path: "/account/wishlist", icon: <FaHeart />, label: "Wishlist", description: "Saved items" },
  ];

  const isActive = (path) => {
    if (path === "/account") return location.pathname === "/account";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="account-sidebar">
      <div className="sidebar-header">
        <h3>Vitrax Home</h3>
        <p>Your account</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
          >
            <div className="sidebar-icon">{item.icon}</div>
            <div className="sidebar-content">
              <span className="sidebar-label">{item.label}</span>
              <span className="sidebar-description">{item.description}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;
