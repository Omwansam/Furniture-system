

import React, { useState, useEffect, useCallback } from "react";
import "./UserManagement.css";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiDownload,
  FiRefreshCw,
  FiUser,
  FiPhone,
  FiMail,
  FiShield,
  FiCalendar,
  FiMapPin,
  FiLock,
  FiUnlock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { usersManagementService } from "../../services/adminService";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalUsers: 0,
    administrators: 0,
    activeUsers: 0,
    newThisMonth: 0
  });

  // Load users data from backend
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersManagementService.getAllUsers({
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm,
        role: filterRole !== "all" ? filterRole : "",
        status: filterStatus !== "all" ? filterStatus : "",
        sort_by: sortBy,
        sort_order: sortOrder
      });
      const list = response?.users || response?.data?.users || response?.data || [];
      setUsers(list);
      
      // Load stats
      const statsResponse = await usersManagementService.getUserStats();
      const s = statsResponse || {};
      setStats({
        totalUsers: s.total_users ?? 0,
        administrators: (s.users_by_role && (s.users_by_role.ADMIN || s.users_by_role['UserRole.ADMIN'])) || 0,
        activeUsers: s.active_users ?? 0,
        newThisMonth: s.new_users_30_days ?? 0
      });
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to empty array
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  // Load users on component mount and when dependencies change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filter and sort users
  const filteredAndSortedUsers = useCallback(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus = filterStatus === "all" || user.is_active === (filterStatus === 'active');
      return matchesSearch && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  // Pagination
  const totalItems = filteredAndSortedUsers().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredAndSortedUsers().slice(startIndex, endIndex);

  // Handle user actions
  const handleAddUser = () => {
    setModalType("add");
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalType("edit");
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setModalType("view");
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersManagementService.deleteUser(userId);
        // Reload users after deletion
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await usersManagementService.toggleUserStatus(userId);
      // Reload users after status change
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to toggle user status. Please try again.');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (modalType === "add") {
        await usersManagementService.createUser(userData);
      } else if (modalType === "edit") {
        await usersManagementService.updateUser(selectedUser.id, userData);
      }
      setShowModal(false);
      // Reload users after save
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    }
  };

  // Export users
  const exportUsers = async (format) => {
    try {
      if (format === 'csv') {
        const response = await usersManagementService.exportUsers();
        // Create download link
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Failed to export users. Please try again.');
    }
  };

  // Refresh data
  const handleRefresh = () => {
    loadUsers();
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      ADMIN: '#dc2626',
      MANAGER: '#ea580c',
      STAFF: '#059669',
      USER: '#7c3aed'
    };
    return colors[role] || '#6b7280';
  };

  // Get status icon
  const getStatusIcon = (isActive) => {
    return isActive ? <FiCheckCircle /> : <FiXCircle />;
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Manage system users, roles, permissions, and access control</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddUser}>
            <FiPlus /> Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUser />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiShield />
          </div>
          <div className="stat-content">
            <h3>{stats.administrators}</h3>
            <p>Administrators</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>{stats.newThisMonth}</h3>
            <p>New This Month</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-filter">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
              <option value="USER">User</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="username">Username</option>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="role">Role</option>
              <option value="created_at">Join Date</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="sort-btn"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        <div className="action-controls">
          <button className="btn btn-secondary" onClick={() => exportUsers('csv')}>
            <FiDownload /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <FiRefreshCw className="spinning" />
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <h3>Users ({totalItems})</h3>
              <p>Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} users</p>
            </div>
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Last Login</th>
                                          {/* <th>Last Logout</th> */}  {/* Temporarily commented until migration is run */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.first_name} {user.last_name}</div>
                            <div className="user-username">@{user.username}</div>
                            <div className="user-email">
                              <FiMail /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="role-badge" 
                          style={{ backgroundColor: getRoleColor(user.role) + '20', color: getRoleColor(user.role) }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-phone">
                            <FiPhone /> {user.phone || 'N/A'}
                          </div>
                          <div className="contact-address">
                            <FiMapPin /> {user.address || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="status-info">
                          <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                            {getStatusIcon(user.is_active)}
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <div className="join-date">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="last-login">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </div>
                      </td>
                      {/* <td>
                        <div className="last-logout">
                          {user.last_logout ? new Date(user.last_logout).toLocaleDateString() : 'Never'}
                        </div>
                      </td> */}  {/* Temporarily commented until migration is run */}
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => handleViewUser(user)}
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditUser(user)}
                            title="Edit User"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className={`btn-icon ${user.is_active ? 'btn-lock' : 'btn-unlock'}`}
                            onClick={() => handleToggleUserStatus(user.id)}
                            title={user.is_active ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.is_active ? <FiLock /> : <FiUnlock />}
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        </div>
        
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`btn btn-page ${page === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        </div>
        
      {/* User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === "add" && "Add New User"}
                {modalType === "edit" && "Edit User"}
                {modalType === "view" && "User Details"}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {modalType === "view" ? (
                <div className="user-details">
                  <div className="user-profile-header">
                    <div className="profile-avatar">
                      {selectedUser.first_name?.charAt(0)}{selectedUser.last_name?.charAt(0)}
                    </div>
                    <div className="profile-info">
                      <h3>{selectedUser.first_name} {selectedUser.last_name}</h3>
                      <p>@{selectedUser.username}</p>
                      <span 
                        className="role-badge large" 
                        style={{ backgroundColor: getRoleColor(selectedUser.role) + '20', color: getRoleColor(selectedUser.role) }}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                  <div className="detail-sections">
                    <div className="detail-section">
                      <h4>Contact Information</h4>
                      <div className="detail-row">
                        <label>Email:</label>
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="detail-row">
                        <label>Phone:</label>
                        <span>{selectedUser.phone || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <label>Address:</label>
                        <span>{selectedUser.address || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="detail-section">
                      <h4>Account Information</h4>
                      <div className="detail-row">
                        <label>Status:</label>
                        <span>{selectedUser.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className="detail-row">
                        <label>Join Date:</label>
                        <span>{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <label>Last Login:</label>
                        <span>{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never'}</span>
                      </div>
                      {/* <div className="detail-row">
                        <label>Last Logout:</label>
                        <span>{selectedUser.last_logout ? new Date(selectedUser.last_logout).toLocaleDateString() : 'Never'}</span>
                      </div> */}  {/* Temporarily commented until migration is run */}
                    </div>
                  </div>
                </div>
              ) : (
                <form className="user-form" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const userData = {
                    username: formData.get('username'),
                    email: formData.get('email'),
                    first_name: formData.get('first_name'),
                    last_name: formData.get('last_name'),
                    role: formData.get('role'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    password: formData.get('password')
                  };
                  handleSaveUser(userData);
                }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="username">Username *</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue={selectedUser?.username || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={selectedUser?.email || ''}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first_name">First Name *</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        defaultValue={selectedUser?.first_name || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="last_name">Last Name *</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        defaultValue={selectedUser?.last_name || ''}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="role">Role *</label>
                      <select id="role" name="role" required>
                        <option value="">Select Role</option>
                        <option value="ADMIN" selected={selectedUser?.role === 'ADMIN'}>Admin</option>
                        <option value="MANAGER" selected={selectedUser?.role === 'MANAGER'}>Manager</option>
                        <option value="STAFF" selected={selectedUser?.role === 'STAFF'}>Staff</option>
                        <option value="USER" selected={selectedUser?.role === 'USER'}>User</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        defaultValue={selectedUser?.phone || ''}
                      />
                    </div>
                  </div>
                  {modalType === "add" && (
                    <div className="form-group">
                      <label htmlFor="password">Password *</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      defaultValue={selectedUser?.address || ''}
                    ></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {modalType === "add" ? "Add User" : "Update User"}
                    </button>
                  </div>
                </form>
              )}
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
