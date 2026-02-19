import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaDownload, FaFilter, FaSort, FaCalendarAlt, FaUser, FaDollarSign, FaBox } from 'react-icons/fa';
import './OrdersManagement.css';
import { orderService } from '../../services/adminService';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("order_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });
  const [updating, setUpdating] = useState(false);

  const refreshOrders = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        orderService.getAllOrders({ 
          page: currentPage, 
          per_page: itemsPerPage,
          status: statusFilter !== 'all' ? statusFilter : '',
          search: searchTerm || ''
        }),
        orderService.getOrderStats(30)
      ]);

      if (ordersRes.orders) {
        setOrders(ordersRes.orders);
      }

      if (statsRes) {
        setOrderStats({
          totalOrders: statsRes.total_orders || 0,
          totalRevenue: statsRes.total_revenue || 0,
          pendingOrders: statsRes.pending_orders || 0,
          completedOrders: statsRes.completed_orders || 0,
          cancelledOrders: statsRes.cancelled_orders || 0
        });
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, searchTerm]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id.toString().includes(searchTerm) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'order_date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (typeof aValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'pending', icon: <FaClock />, label: 'Pending' },
      'processing': { class: 'processing', icon: <FaTruck />, label: 'Processing' },
      'shipped': { class: 'shipped', icon: <FaTruck />, label: 'Shipped' },
      'delivered': { class: 'completed', icon: <FaCheckCircle />, label: 'Delivered' },
      'cancelled': { class: 'cancelled', icon: <FaTimesCircle />, label: 'Cancelled' },
      'returned': { class: 'returned', icon: <FaBox />, label: 'Returned' }
    };

    const config = statusConfig[status] || { class: 'unknown', icon: <FaClock />, label: status };
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { class: 'pending', label: 'Pending' },
      'COMPLETED': { class: 'completed', label: 'Paid' },
      'FAILED': { class: 'failed', label: 'Failed' },
      'REFUNDED': { class: 'refunded', label: 'Refunded' }
    };

    const config = statusConfig[status] || { class: 'unknown', label: status };
    
    return (
      <span className={`payment-status-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`Update order #${orderId} status to ${newStatus}?`)) return;
    
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await refreshOrders();
    } catch (e) {
      console.error('Status update failed:', e);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleExport = async () => {
    try {
      const data = await orderService.getAllOrders({ per_page: 1000 });
      const orders = data.orders || [];
      
      if (!orders.length) return;
      
      const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Status', 'Total', 'Items'];
      const csv = [
        headers.join(','),
        ...orders.map(order => [
          order.order_id,
          order.user.username,
          order.user.email,
          order.order_date,
          order.order_status,
          order.total_amount,
          order.items_count
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  if (loading) {
    return (
      <div className="orders-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-management">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <FaDownload /> Export
          </button>
          <button className="btn btn-secondary" onClick={refreshOrders}>
            <FaEye /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaBox />
          </div>
          <div className="stat-info">
            <h3>{orderStats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(orderStats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{orderStats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{orderStats.completedOrders}</h3>
            <p>Completed Orders</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="orders-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="order_date">Order Date</option>
            <option value="order_id">Order ID</option>
            <option value="total_amount">Total Amount</option>
            <option value="user.username">Customer Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.order_id}>
                <td>
                  <span className="order-id">#{order.order_id}</span>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{order.user.username}</div>
                    <div className="customer-email">{order.user.email}</div>
                  </div>
                </td>
                <td>
                  <span className="order-date">
                    <FaCalendarAlt /> {formatDate(order.order_date)}
                  </span>
                </td>
                <td>{getStatusBadge(order.order_status)}</td>
                <td>{getPaymentStatusBadge(order.payment_status)}</td>
                <td>
                  <span className="order-total">
                    {formatCurrency(order.total_amount)}
                  </span>
                </td>
                <td>
                  <span className="items-count">
                    {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => openOrderModal(order)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                                         <button
                       className="btn-icon edit"
                       onClick={() => handleStatusUpdate(order.order_id, 'processing')}
                       disabled={updating || order.order_status === 'processing'}
                       title="Mark as Processing"
                     >
                       <FaTruck />
                     </button>
                     <button
                       className="btn-icon success"
                       onClick={() => handleStatusUpdate(order.order_id, 'delivered')}
                       disabled={updating || order.order_status === 'delivered'}
                       title="Mark as Delivered"
                     >
                       <FaCheckCircle />
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        
        <div className="pagination-info">
          Page {currentPage}
        </div>
        
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={sortedOrders.length < itemsPerPage}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Order #{selectedOrder.order_id} Details</h3>
              <button className="close-btn" onClick={() => setShowOrderModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                <div className="detail-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.user.username}</p>
                  <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                  <p><strong>Order Date:</strong> {formatDate(selectedOrder.order_date)}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Order Information</h4>
                  <p><strong>Status:</strong> {getStatusBadge(selectedOrder.order_status)}</p>
                  <p><strong>Total Amount:</strong> {formatCurrency(selectedOrder.total_amount)}</p>
                  <p><strong>Items Count:</strong> {selectedOrder.items_count}</p>
                  <p><strong>Shipping Address:</strong> {selectedOrder.shipping_address}</p>
                </div>

                <div className="detail-section">
                  <h4>Payment Information</h4>
                  <p><strong>Payment Status:</strong> {getPaymentStatusBadge(selectedOrder.payment_status)}</p>
                  <p><strong>Shipping Status:</strong> {selectedOrder.shipping_status}</p>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowOrderModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
