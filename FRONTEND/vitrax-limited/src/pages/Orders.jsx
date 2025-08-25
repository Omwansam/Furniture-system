import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaDownload, 
  FaTruck, 
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import AccountLayout from '../components/AccountLayout';
import './Orders.css';

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: [
        { name: 'Modern Sofa Set', quantity: 1, price: 199.99 },
        { name: 'Coffee Table', quantity: 1, price: 100.00 }
      ],
      shippingAddress: '123 Main St, Nairobi, Kenya',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Processing',
      total: 450.00,
      items: [
        { name: 'Dining Table Set', quantity: 1, price: 300.00 },
        { name: 'Chair Set', quantity: 4, price: 150.00 }
      ],
      shippingAddress: '456 Oak Ave, Mombasa, Kenya',
      trackingNumber: null
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Shipped',
      total: 199.99,
      items: [
        { name: 'Bed Frame', quantity: 1, price: 199.99 }
      ],
      shippingAddress: '789 Pine Rd, Kisumu, Kenya',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-004',
      date: '2023-12-28',
      status: 'Cancelled',
      total: 150.00,
      items: [
        { name: 'Side Table', quantity: 1, price: 150.00 }
      ],
      shippingAddress: '321 Elm St, Nakuru, Kenya',
      trackingNumber: null
    }
  ];

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'processing':
        return <FaClock className="status-icon processing" />;
      case 'cancelled':
        return <FaTimes className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <AccountLayout>
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {/* Filters and Search */}
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
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <Link to="/shop" className="shop-now-btn">Shop Now</Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-basic-info">
                    <h3>Order {order.id}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status-section">
                    {getStatusIcon(order.status)}
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value total">${order.total.toFixed(2)}</span>
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
                  <Link to={`/orders/${order.id}`} className="action-btn view-btn">
                    <FaEye />
                    View Details
                  </Link>
                  {order.status === 'Delivered' && (
                    <button className="action-btn download-btn">
                      <FaDownload />
                      Download Invoice
                    </button>
                  )}
                  {order.trackingNumber && (
                    <button className="action-btn track-btn">
                      <FaTruck />
                      Track Package
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Statistics */}
        <div className="order-stats">
          <div className="stat-item">
            <h4>Total Orders</h4>
            <span className="stat-number">{orders.length}</span>
          </div>
          <div className="stat-item">
            <h4>Total Spent</h4>
            <span className="stat-number">
              ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </span>
          </div>
          <div className="stat-item">
            <h4>Delivered</h4>
            <span className="stat-number">
              {orders.filter(order => order.status === 'Delivered').length}
            </span>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Orders;
