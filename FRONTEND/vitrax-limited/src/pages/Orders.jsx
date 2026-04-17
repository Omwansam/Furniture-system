import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaDownload,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import { apiUrl } from "../config/api";
import { getAuthToken } from "../utils/authUtils";
import "./Orders.css";

const normalize = (raw) =>
  (raw || []).map((o) => ({
    id: `ORD-${o.order_id}`,
    order_id: o.order_id,
    date: o.date,
    status: (o.status || "").toString(),
    total: Number(o.total) || 0,
    items: o.items || [],
    shippingAddress: o.shipping_address || "",
    trackingNumber: o.tracking_number || null,
  }));

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        const res = await fetch(apiUrl("/orders/me"), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Could not load orders");
        const data = await res.json();
        if (!cancelled) setOrders(normalize(data.orders));
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load orders");
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getStatusIcon = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return <FaCheckCircle className="status-icon delivered" />;
    if (s === "shipped") return <FaTruck className="status-icon shipped" />;
    if (s === "processing" || s === "pending") return <FaClock className="status-icon processing" />;
    if (s === "cancelled") return <FaTimes className="status-icon cancelled" />;
    return <FaClock className="status-icon" />;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || (order.status || "").toLowerCase() === filterStatus;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.items.some((item) => (item.name || "").toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="orders-container">
        <p className="text-muted">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <p className="text-muted">{error}</p>
        <button type="button" className="shop-now-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <div className="orders-controls">
        <div className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search orders or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <FaFilter className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <h3>No orders found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <Link to="/shop" className="shop-now-btn">
              Shop Now
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-basic-info">
                  <h3>Order {order.id}</h3>
                  <p className="order-date">
                    Placed on {order.date ? new Date(order.date).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div className="order-status-section">
                  {getStatusIcon(order.status)}
                  <span className={`status-badge ${(order.status || "").toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items ({order.items.length})</h4>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={`${order.order_id}-${index}`} className="item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">Ksh {Number(item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value total">Ksh {order.total.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Shipping Address:</span>
                  <span className="detail-value">{order.shippingAddress}</span>
                </div>
                {order.trackingNumber && (
                  <div className="detail-row">
                    <span className="detail-label">Tracking Number:</span>
                    <span className="detail-value tracking">{order.trackingNumber}</span>
                  </div>
                )}
              </div>

              <div className="order-actions">
                <Link to={`/order-confirmation/${order.order_id}`} className="action-btn view-btn">
                  <FaEye />
                  View summary
                </Link>
                {order.status?.toLowerCase() === "delivered" && (
                  <button type="button" className="action-btn download-btn">
                    <FaDownload />
                    Download Invoice
                  </button>
                )}
                {order.trackingNumber && (
                  <button type="button" className="action-btn track-btn">
                    <FaTruck />
                    Track Package
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="order-stats">
        <div className="stat-item">
          <h4>Total Orders</h4>
          <span className="stat-number">{orders.length}</span>
        </div>
        <div className="stat-item">
          <h4>Total Spent</h4>
          <span className="stat-number">Ksh {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <h4>Delivered</h4>
          <span className="stat-number">
            {orders.filter((order) => order.status?.toLowerCase() === "delivered").length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Orders;
