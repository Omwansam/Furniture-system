import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaBox, 
  FaHeart, 
  FaMapMarkerAlt, 
  FaTicketAlt,
  FaDownload,
  FaShoppingCart,
  FaStar,
  FaEye
} from 'react-icons/fa';
import AccountLayout from '../components/AccountLayout';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2024'
  });

  const [stats, setStats] = useState({
    totalOrders: 12,
    totalSpent: 2450.00,
    favoriteItems: 8,
    activeCoupons: 2
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: 2
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Processing',
      total: 450.00,
      items: 3
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Shipped',
      total: 199.99,
      items: 1
    }
  ]);

  return (
    <AccountLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaShoppingCart />
            </div>
            <div className="stat-content">
              <h3>${stats.totalSpent.toFixed(2)}</h3>
              <p>Total Spent</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaHeart />
            </div>
            <div className="stat-content">
              <h3>{stats.favoriteItems}</h3>
              <p>Favorite Items</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaTicketAlt />
            </div>
            <div className="stat-content">
              <h3>{stats.activeCoupons}</h3>
              <p>Active Coupons</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/orders" className="action-card">
              <FaBox className="action-icon" />
              <span>View Orders</span>
            </Link>
            <Link to="/wishlist" className="action-card">
              <FaHeart className="action-icon" />
              <span>My Wishlist</span>
            </Link>
            <Link to="/addresses" className="action-card">
              <FaMapMarkerAlt className="action-icon" />
              <span>Manage Addresses</span>
            </Link>
            <Link to="/coupons" className="action-card">
              <FaTicketAlt className="action-icon" />
              <span>My Coupons</span>
            </Link>
            <Link to="/downloads" className="action-card">
              <FaDownload className="action-icon" />
              <span>Downloads</span>
            </Link>
            <Link to="/account-details" className="action-card">
              <FaUser className="action-icon" />
              <span>Account Details</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/orders" className="view-all">View All Orders</Link>
          </div>
          
          <div className="orders-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <h4>Order {order.id}</h4>
                  <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                  <p className="order-items">{order.items} item(s)</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <p className="order-total">${order.total.toFixed(2)}</p>
                </div>
                <div className="order-actions">
                  <Link to={`/orders/${order.id}`} className="view-order-btn">
                    <FaEye />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Summary */}
        <div className="account-summary">
          <h2>Account Summary</h2>
          <div className="summary-content">
            <div className="summary-item">
              <strong>Name:</strong> {user.name}
            </div>
            <div className="summary-item">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="summary-item">
              <strong>Member Since:</strong> {user.memberSince}
            </div>
            <div className="summary-item">
              <strong>Last Login:</strong> Today at 2:30 PM
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Dashboard;
