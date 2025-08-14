import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus, FaFilter, FaDownload, FaUserPlus, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [customerStats, setCustomerStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    newThisMonth: 0
  });

  // Mock data for demonstration - replace with actual API calls
  const mockCustomers = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      is_admin: false,
      joinDate: "2023-06-15",
      lastLogin: "2024-01-15",
      orderCount: 12,
      totalSpent: 2450.50,
      status: "active",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001"
    },
    {
      id: 2,
      username: "sarah_admin",
      email: "sarah@company.com",
      is_admin: true,
      joinDate: "2023-01-10",
      lastLogin: "2024-01-16",
      orderCount: 0,
      totalSpent: 0,
      status: "active",
      phone: "+1 (555) 234-5678",
      address: "456 Admin Ave, Los Angeles, CA 90210"
    },
    {
      id: 3,
      username: "mike_wilson",
      email: "mike@example.com",
      is_admin: false,
      joinDate: "2023-09-22",
      lastLogin: "2024-01-10",
      orderCount: 5,
      totalSpent: 890.25,
      status: "active",
      phone: "+1 (555) 345-6789",
      address: "789 Pine St, Chicago, IL 60601"
    },
    {
      id: 4,
      username: "inactive_user",
      email: "inactive@example.com",
      is_admin: false,
      joinDate: "2023-03-15",
      lastLogin: "2023-12-01",
      orderCount: 2,
      totalSpent: 150.00,
      status: "inactive",
      phone: "+1 (555) 456-7890",
      address: "321 Oak St, Miami, FL 33101"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setCustomers(mockCustomers);
      setCustomerStats({
        total: mockCustomers.length,
        active: mockCustomers.filter(c => c.status === 'active').length,
        admins: mockCustomers.filter(c => c.is_admin).length,
        newThisMonth: mockCustomers.filter(c => {
          const joinDate = new Date(c.joinDate);
          const now = new Date();
          return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
        }).length
      });
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "admin" && customer.is_admin) ||
      (statusFilter === "active" && customer.status === "active") ||
      (statusFilter === "inactive" && customer.status === "inactive");
    
    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'totalSpent' || sortBy === 'orderCount') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const getStatusBadge = (customer) => {
    if (customer.is_admin) {
      return <span className="status-badge admin">Admin</span>;
    } else if (customer.status === 'active') {
      return <span className="status-badge active">Active</span>;
    } else {
      return <span className="status-badge inactive">Inactive</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="customer-header">
        <h1>Customer Management</h1>
        <div className="header-actions">
          <button className="btn btn-primary">
            <FaUserPlus /> Add Customer
          </button>
          <button className="btn btn-secondary">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUserPlus />
          </div>
          <div className="stat-info">
            <h3>{customerStats.total}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <FaUserPlus />
          </div>
          <div className="stat-info">
            <h3>{customerStats.active}</h3>
            <p>Active Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon admin">
            <FaUserPlus />
          </div>
          <div className="stat-info">
            <h3>{customerStats.admins}</h3>
            <p>Admin Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon new">
            <FaUserPlus />
          </div>
          <div className="stat-info">
            <h3>{customerStats.newThisMonth}</h3>
            <p>New This Month</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="customer-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search customers..."
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
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="admin">Admin Users</option>
          </select>
        </div>

        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="joinDate">Join Date</option>
            <option value="totalSpent">Total Spent</option>
            <option value="orderCount">Order Count</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="customer-table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {customer.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="customer-name">{customer.username}</div>
                      <div className="customer-id">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td>{customer.email}</td>
                <td>{getStatusBadge(customer)}</td>
                <td>{formatDate(customer.joinDate)}</td>
                <td>{customer.orderCount}</td>
                <td>{formatCurrency(customer.totalSpent)}</td>
                <td>{formatDate(customer.lastLogin)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => handleViewCustomer(customer)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button className="btn-icon" title="Edit Customer">
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete" title="Delete Customer">
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
          Page {currentPage} of {totalPages}
        </div>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowCustomerDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Customer Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowCustomerDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="customer-details">
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <FaUserPlus className="detail-icon" />
                      <div>
                        <label>Username</label>
                        <p>{selectedCustomer.username}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaEnvelope className="detail-icon" />
                      <div>
                        <label>Email</label>
                        <p>{selectedCustomer.email}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaPhone className="detail-icon" />
                      <div>
                        <label>Phone</label>
                        <p>{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      <div>
                        <label>Address</label>
                        <p>{selectedCustomer.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Account Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <div>
                        <label>Join Date</label>
                        <p>{formatDate(selectedCustomer.joinDate)}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <div>
                        <label>Last Login</label>
                        <p>{formatDate(selectedCustomer.lastLogin)}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaShoppingCart className="detail-icon" />
                      <div>
                        <label>Total Orders</label>
                        <p>{selectedCustomer.orderCount}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaDollarSign className="detail-icon" />
                      <div>
                        <label>Total Spent</label>
                        <p>{formatCurrency(selectedCustomer.totalSpent)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default CustomerManagement

