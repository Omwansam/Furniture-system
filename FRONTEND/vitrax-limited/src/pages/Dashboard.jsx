import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaDownload,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { apiUrl } from "../config/api";
import { getAuthToken } from "../utils/authUtils";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const { favoritesCount } = useFavorites();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(apiUrl("/orders/me"), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("orders");
        const data = await res.json();
        if (!cancelled) setOrders(data.orders || []);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName =
    user?.username || user?.email?.split("@")[0] || "Member";
  const totalSpent = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const recent = [...orders]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {displayName}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBox />
          </div>
          <div className="stat-content">
            <h3>{loading ? "—" : orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Ksh {totalSpent.toLocaleString()}</h3>
            <p>Total Spent</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaHeart />
          </div>
          <div className="stat-content">
            <h3>{favoritesCount}</h3>
            <p>Wishlist</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaTicketAlt />
          </div>
          <div className="stat-content">
            <h3>—</h3>
            <p>Active Coupons</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/account/orders" className="action-card">
            <FaBox className="action-icon" />
            <span>View Orders</span>
          </Link>
          <Link to="/account/wishlist" className="action-card">
            <FaHeart className="action-icon" />
            <span>My Wishlist</span>
          </Link>
          <Link to="/account/addresses" className="action-card">
            <FaMapMarkerAlt className="action-icon" />
            <span>Manage Addresses</span>
          </Link>
          <Link to="/account/coupons" className="action-card">
            <FaTicketAlt className="action-icon" />
            <span>My Coupons</span>
          </Link>
          <Link to="/account/downloads" className="action-card">
            <FaDownload className="action-icon" />
            <span>Downloads</span>
          </Link>
          <Link to="/account/settings" className="action-card">
            <FaUser className="action-icon" />
            <span>Account Settings</span>
          </Link>
        </div>
      </div>

      <div className="recent-orders">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/account/orders" className="view-all">
            View All Orders
          </Link>
        </div>

        <div className="orders-list">
          {recent.length === 0 && !loading ? (
            <p className="text-muted">No orders yet. Start shopping to see them here.</p>
          ) : (
            recent.map((order) => (
              <div key={order.order_id} className="order-item">
                <div className="order-info">
                  <h4>Order ORD-{order.order_id}</h4>
                  <p className="order-date">
                    {order.date ? new Date(order.date).toLocaleDateString() : "—"}
                  </p>
                  <p className="order-items">{(order.items || []).length} item(s)</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${(order.status || "").toLowerCase()}`}>
                    {order.status}
                  </span>
                  <p className="order-total">Ksh {Number(order.total || 0).toLocaleString()}</p>
                </div>
                <div className="order-actions">
                  <Link to={`/order-confirmation/${order.order_id}`} className="view-order-btn">
                    <FaEye />
                    Summary
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="account-summary">
        <h2>Account Summary</h2>
        <div className="summary-content">
          <div className="summary-item">
            <strong>Username:</strong> {user?.username || "—"}
          </div>
          <div className="summary-item">
            <strong>Email:</strong> {user?.email || "—"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
