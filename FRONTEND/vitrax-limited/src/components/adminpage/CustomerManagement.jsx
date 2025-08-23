import React, { useState, useEffect } from 'react';
import { userService } from '../../services/adminService';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      // Filter out admin users to show only customers
      const customerData = data.filter(user => !user.is_admin);
      setCustomers(customerData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    const filtered = customers.filter(customer =>
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      setShowAddModal(false);
      setFormData({ username: '', email: '', password: '', is_admin: false });
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      delete updateData.password; // Don't update password if empty
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await userService.updateUser(editingCustomer.id, updateData);
      setShowEditModal(false);
      setEditingCustomer(null);
      setFormData({ username: '', email: '', password: '', is_admin: false });
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await userService.deleteUser(customerId);
        fetchCustomers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) {
      try {
        await Promise.all(selectedCustomers.map(id => userService.deleteUser(id)));
        setSelectedCustomers([]);
        fetchCustomers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      username: customer.username,
      email: customer.email,
      password: '',
      is_admin: customer.is_admin
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
      {/* Header */}
      <div className="customer-header">
        <div className="header-content">
          <h1>Customer Management</h1>
          <p>Manage your customer accounts and information</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i>
            Add Customer
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <span className="results-count">
            {filteredCustomers.length} customers found
          </span>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            {selectedCustomers.length} customer(s) selected
          </div>
          <div className="bulk-buttons">
            <button 
              onClick={handleBulkDelete}
              className="btn btn-danger"
            >
              <i className="fas fa-trash"></i>
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                  onChange={handleSelectAll}
                  className="select-checkbox"
                />
              </th>
              <th>Customer</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <div className="empty-content">
                    <i className="fas fa-users empty-icon"></i>
                    <h3>No customers found</h3>
                    <p>Try adjusting your search criteria or add a new customer.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="select-checkbox"
                    />
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="customer-details">
                        <div className="customer-name">{customer.username}</div>
                        <div className="customer-id">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <span className="email-text">{customer.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge status-active">
                      Active
                    </span>
                  </td>
                  <td>
                    <span className="date-text">
                      {customer.created_at ? formatDate(customer.created_at) : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(customer)}
                        className="action-btn btn-edit"
                        title="Edit Customer"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="action-btn btn-delete"
                        title="Delete Customer"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Customer</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="close-modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="customer-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_admin}
                    onChange={(e) => setFormData({...formData, is_admin: e.target.checked})}
                    className="checkbox-input"
                  />
                  Admin privileges
                </label>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Customer</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="close-modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleEditCustomer} className="customer-form">
              <div className="form-group">
                <label htmlFor="edit-username">Username</label>
                <input
                  type="text"
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  type="email"
                  id="edit-email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-password">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  id="edit-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_admin}
                    onChange={(e) => setFormData({...formData, is_admin: e.target.checked})}
                    className="checkbox-input"
                  />
                  Admin privileges
                </label>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
