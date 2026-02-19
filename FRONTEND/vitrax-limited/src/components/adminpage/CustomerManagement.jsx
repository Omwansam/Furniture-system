import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaUser, FaUsers, FaDollarSign, FaCalendarAlt, FaDownload, FaFilter, FaSort, FaStar, FaChartLine, FaUserPlus, FaUserEdit, FaTrash, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import './CustomerManagement.css';
import { userService } from '../../services/adminService';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomers: 0,
    inactiveCustomers: 0
  });
  const [topCustomers, setTopCustomers] = useState([]);
  
  // Edit and Delete states
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const refreshCustomers = async () => {
    setLoading(true);
    try {
      const [customersRes, statsRes] = await Promise.all([
        userService.getAllCustomers({ 
          page: currentPage, 
          per_page: itemsPerPage,
          status: statusFilter !== 'all' ? statusFilter : '',
          search: searchTerm || ''
        }),
        userService.getCustomerStats(30)
      ]);

      if (customersRes.customers) {
        setCustomers(customersRes.customers);
      }

      if (statsRes) {
        setCustomerStats({
          totalCustomers: statsRes.total_customers || 0,
          activeCustomers: statsRes.active_customers || 0,
          newCustomers: statsRes.new_customers || 0,
          inactiveCustomers: statsRes.inactive_customers || 0
        });
        setTopCustomers(statsRes.top_customers || []);
      }
    } catch (e) {
      console.error('Failed to load customers:', e);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, searchTerm]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'created_at') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
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
      'active': { class: 'active', label: 'Active' },
      'inactive': { class: 'inactive', label: 'Inactive' }
    };

    const config = statusConfig[status] || { class: 'unknown', label: status };
    
    return (
      <span className={`status-badge ${config.class}`}>
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
      day: 'numeric'
    });
  };

  const openCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // Edit customer functions
  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setEditForm({
      username: customer.username,
      email: customer.email
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateCustomer(editingCustomer.id, editForm);
      setShowEditModal(false);
      setEditingCustomer(null);
      setEditForm({ username: '', email: '' });
      await refreshCustomers();
    } catch (error) {
      console.error('Failed to update customer:', error);
      alert('Failed to update customer');
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingCustomer(null);
    setEditForm({ username: '', email: '' });
  };

  // Delete customer functions
  const openDeleteModal = (customer) => {
    setDeletingCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteCustomer(deletingCustomer.id);
      setShowDeleteModal(false);
      setDeletingCustomer(null);
      await refreshCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert('Failed to delete customer');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletingCustomer(null);
  };

  const handleExport = async () => {
    try {
      const data = await userService.getAllCustomers({ per_page: 1000 });
      const customers = data.customers || [];
      
      if (!customers.length) return;
      
      const headers = ['ID', 'Username', 'Email', 'Status', 'Order Count', 'Total Spent', 'Last Order'];
      const csv = [
        headers.join(','),
        ...customers.map(customer => [
          customer.id,
          customer.username,
          customer.email,
          customer.status,
          customer.order_count,
          customer.total_spent,
          customer.last_order_date || 'N/A'
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  if (loading) {
    return (
      <div className="customer-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-management">
      <div className="customers-header">
          <h1>Customer Management</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <FaDownload /> Export
          </button>
          <button className="btn btn-secondary" onClick={refreshCustomers}>
            <FaEye /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{customerStats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FaUser />
          </div>
          <div className="stat-info">
            <h3>{customerStats.activeCustomers}</h3>
            <p>Active Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FaUserPlus />
          </div>
          <div className="stat-info">
            <h3>{customerStats.newCustomers}</h3>
            <p>New Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon inactive">
            <FaUserEdit />
          </div>
          <div className="stat-info">
            <h3>{customerStats.inactiveCustomers}</h3>
            <p>Inactive Customers</p>
          </div>
        </div>
      </div>

      {/* Top Customers Section */}
      {topCustomers.length > 0 && (
        <div className="top-customers-section">
          <h3>Top Customers by Spending</h3>
          <div className="top-customers-grid">
            {topCustomers.slice(0, 5).map((customer, index) => (
              <div key={customer.id} className="top-customer-card">
                <div className="rank-badge">{index + 1}</div>
                <div className="customer-info">
                  <h4>{customer.username}</h4>
                  <p>{customer.email}</p>
                  <div className="customer-stats">
                    <span className="spending">{formatCurrency(customer.total_spent)}</span>
                    <span className="orders">{customer.order_count} orders</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="customers-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by username or email..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
      </div>

        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="created_at">Join Date</option>
            <option value="order_count">Order Count</option>
            <option value="total_spent">Total Spent</option>
            <option value="username">Username</option>
          </select>
            <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            >
            {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

      {/* Customers Table */}
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Status</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{customer.username}</div>
                    <div className="customer-email">{customer.email}</div>
                  </div>
                </td>
                <td>{getStatusBadge(customer.status)}</td>
                <td>
                  <span className="order-count">
                    {customer.order_count} order{customer.order_count !== 1 ? 's' : ''}
                  </span>
                  </td>
                  <td>
                  <span className="total-spent">
                    {formatCurrency(customer.total_spent)}
                    </span>
                  </td>
                  <td>
                  <span className="last-order">
                    <FaCalendarAlt /> {formatDate(customer.last_order_date)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                      className="btn-icon"
                      onClick={() => openCustomerModal(customer)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn-icon edit"
                        onClick={() => openEditModal(customer)}
                        title="Edit Customer"
                      >
                      <FaEdit />
                      </button>
                      <button
                      className="btn-icon delete"
                      onClick={() => openDeleteModal(customer)}
                        title="Delete Customer"
                      >
                      <FaTrash />
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
          disabled={sortedCustomers.length < itemsPerPage}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Customer Details</h3>
              <button className="close-btn" onClick={() => setShowCustomerModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="customer-details">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <p><strong>Username:</strong> {selectedCustomer.username}</p>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedCustomer.status)}</p>
              </div>
                
                <div className="detail-section">
                  <h4>Order Summary</h4>
                  <p><strong>Total Orders:</strong> {selectedCustomer.order_count}</p>
                  <p><strong>Total Spent:</strong> {formatCurrency(selectedCustomer.total_spent)}</p>
                  <p><strong>Last Order:</strong> {formatDate(selectedCustomer.last_order_date)}</p>
              </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCustomerModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Customer</h3>
              <button className="close-btn" onClick={handleEditCancel}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                  <label htmlFor="username">Username</label>
                <input
                  type="text"
                    id="username"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
                
              <div className="form-group">
                  <label htmlFor="email">Email</label>
                <input
                  type="email"
                    id="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    <FaCheck /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCustomer && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Delete Customer</h3>
              <button className="close-btn" onClick={handleDeleteCancel}>×</button>
              </div>
            <div className="modal-body">
              <div className="delete-warning">
                <FaTimes className="warning-icon" />
                <h4>Are you sure you want to delete this customer?</h4>
                <p><strong>{deletingCustomer.username}</strong> ({deletingCustomer.email})</p>
                <p className="warning-text">
                  This action cannot be undone. All customer data will be permanently removed.
                </p>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  <FaTrash /> Delete Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
