import React, { useState, useEffect, useCallback } from "react";
import "./SuppliersManagement.css";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiPackage,
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { suppliersService } from "../../services/adminService";

export default function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // add, edit, view
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    topRated: 0,
    activeSuppliers: 0,
    totalProducts: 0
  });

  // Load suppliers data from backend
  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await suppliersService.getAllSuppliers({
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm,
        category: filterCategory !== "all" ? filterCategory : "",
        sort_by: sortBy,
        sort_order: sortOrder
      });
      const suppliersPayload = response?.data?.suppliers || response?.suppliers || response?.data || [];
      setSuppliers(suppliersPayload);
      
      // Load stats
      const statsResponse = await suppliersService.getSupplierStats();
      const s = statsResponse?.data || statsResponse || {};
      setStats(prev => ({
        totalSuppliers: s.total_suppliers ?? prev.totalSuppliers,
        topRated: Array.isArray(s.top_rated) ? s.top_rated.length : prev.topRated,
        activeSuppliers: s.active_suppliers ?? prev.activeSuppliers,
        totalProducts: prev.totalProducts // will recompute below from suppliers
      }));

      // Derive totalProducts from suppliers list if available
      const totalProducts = (suppliersPayload || []).reduce((sum, sp) => sum + (sp.products || 0), 0);
      setStats(prev => ({ ...prev, totalProducts }));
    } catch (error) {
      console.error('Error loading suppliers:', error);
      // Fallback to empty array
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filterCategory, sortBy, sortOrder]);

  // Load suppliers on component mount and when dependencies change
  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // Filter and sort suppliers
  const filteredAndSortedSuppliers = useCallback(() => {
    let filtered = suppliers.filter(supplier => {
      const matchesSearch = (supplier.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (supplier.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || supplier.category === filterCategory;
      return matchesSearch && matchesCategory;
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
  }, [suppliers, searchTerm, filterCategory, sortBy, sortOrder]);

  // Pagination
  const totalItems = filteredAndSortedSuppliers().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredAndSortedSuppliers().slice(startIndex, endIndex);

  // Handle supplier actions
  const handleAddSupplier = () => {
    setModalType("add");
    setSelectedSupplier(null);
    setShowModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setModalType("edit");
    setSelectedSupplier(supplier);
    setShowModal(true);
  };

  const handleViewSupplier = (supplier) => {
    setModalType("view");
    setSelectedSupplier(supplier);
    setShowModal(true);
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await suppliersService.deleteSupplier(supplierId);
        // Reload suppliers after deletion
        loadSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier. Please try again.');
      }
    }
  };

  const handleSaveSupplier = async (supplierData) => {
    try {
      if (modalType === "add") {
        await suppliersService.createSupplier(supplierData);
      } else if (modalType === "edit") {
        await suppliersService.updateSupplier(selectedSupplier.supplier_id, supplierData);
      }
      setShowModal(false);
      // Reload suppliers after save
      loadSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Failed to save supplier. Please try again.');
    }
  };

  // Export suppliers
  const exportSuppliers = async (format) => {
    try {
      if (format === 'csv') {
        const response = await suppliersService.exportSuppliers();
        // Create download link
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'suppliers.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting suppliers:', error);
      alert('Failed to export suppliers. Please try again.');
    }
  };

  // Refresh data
  const handleRefresh = () => {
    loadSuppliers();
  };

  return (
    <div className="suppliers-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Suppliers Management</h1>
          <p>Manage your furniture suppliers, track performance, and maintain relationships</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddSupplier}>
            <FiPlus /> Add Supplier
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <h3>{stats.totalSuppliers}</h3>
            <p>Total Suppliers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiStar />
          </div>
          <div className="stat-content">
            <h3>{stats.topRated}</h3>
            <p>Top Rated</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <h3>{stats.activeSuppliers}</h3>
            <p>Active Suppliers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
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
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="Furniture">Furniture</option>
              <option value="Design">Design</option>
              <option value="Wood">Wood</option>
              <option value="Sustainable">Sustainable</option>
              <option value="Textiles">Textiles</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="rating">Rating</option>
              <option value="status">Status</option>
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
          <button className="btn btn-secondary" onClick={() => exportSuppliers('csv')}>
            <FiDownload /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <FiRefreshCw className="spinning" />
            <p>Loading suppliers...</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <h3>Suppliers ({totalItems})</h3>
              <p>Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} suppliers</p>
            </div>
            <div className="table-wrapper">
              <table className="suppliers-table">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Category</th>
                    <th>Contact</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Last Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSuppliers.map(supplier => (
                    <tr key={supplier.supplier_id}>
                      <td>
                        <div className="supplier-info">
                          <div className="supplier-name">{supplier.name}</div>
                          <div className="supplier-website">
                            <FiGlobe /> {supplier.website || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{supplier.category}</span>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-name">{supplier.contact_person}</div>
                          <div className="contact-email">
                            <FiMail /> {supplier.email}
                          </div>
                          <div className="contact-phone">
                            <FiPhone /> {supplier.phone}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="rating">
                          <FiStar className="star-icon" />
                          <span>{supplier.rating || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${supplier.status}`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td>
                        {supplier.last_order_date ? new Date(supplier.last_order_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => handleViewSupplier(supplier)}
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditSupplier(supplier)}
                            title="Edit Supplier"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteSupplier(supplier.supplier_id)}
                            title="Delete Supplier"
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

      {/* Supplier Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === "add" && "Add New Supplier"}
                {modalType === "edit" && "Edit Supplier"}
                {modalType === "view" && "Supplier Details"}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {modalType === "view" ? (
                <div className="supplier-details">
                  <div className="detail-row">
                    <label>Name:</label>
                    <span>{selectedSupplier.name}</span>
                  </div>
                  <div className="detail-row">
                    <label>Category:</label>
                    <span>{selectedSupplier.category}</span>
                  </div>
                  <div className="detail-row">
                    <label>Contact:</label>
                    <span>{selectedSupplier.contact_person}</span>
                  </div>
                  <div className="detail-row">
                    <label>Email:</label>
                    <span>{selectedSupplier.email}</span>
                  </div>
                  <div className="detail-row">
                    <label>Phone:</label>
                    <span>{selectedSupplier.phone}</span>
                  </div>
                  <div className="detail-row">
                    <label>Address:</label>
                    <span>{selectedSupplier.address}</span>
                  </div>
                  <div className="detail-row">
                    <label>Website:</label>
                    <span>{selectedSupplier.website || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Rating:</label>
                    <span>{selectedSupplier.rating || 'N/A'}/5</span>
                  </div>
                  <div className="detail-row">
                    <label>Status:</label>
                    <span>{selectedSupplier.status}</span>
                  </div>
                  <div className="detail-row">
                    <label>Notes:</label>
                    <span>{selectedSupplier.notes || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Last Order:</label>
                    <span>{selectedSupplier.last_order_date ? new Date(selectedSupplier.last_order_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <form className="supplier-form" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const supplierData = {
                    name: formData.get('name'),
                    category: formData.get('category'),
                    contact_person: formData.get('contact_person'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    website: formData.get('website'),
                    notes: formData.get('notes')
                  };
                  handleSaveSupplier(supplierData);
                }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Supplier Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={selectedSupplier?.name || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="category">Category *</label>
                      <select id="category" name="category" required>
                        <option value="">Select Category</option>
                        <option value="Furniture" selected={selectedSupplier?.category === 'Furniture'}>Furniture</option>
                        <option value="Design" selected={selectedSupplier?.category === 'Design'}>Design</option>
                        <option value="Wood" selected={selectedSupplier?.category === 'Wood'}>Wood</option>
                        <option value="Sustainable" selected={selectedSupplier?.category === 'Sustainable'}>Sustainable</option>
                        <option value="Textiles" selected={selectedSupplier?.category === 'Textiles'}>Textiles</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact_person">Contact Person *</label>
                      <input
                        type="text"
                        id="contact_person"
                        name="contact_person"
                        defaultValue={selectedSupplier?.contact_person || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={selectedSupplier?.email || ''}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        defaultValue={selectedSupplier?.phone || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="website">Website</label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        defaultValue={selectedSupplier?.website || ''}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      defaultValue={selectedSupplier?.address || ''}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      defaultValue={selectedSupplier?.notes || ''}
                    ></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {modalType === "add" ? "Add Supplier" : "Update Supplier"}
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
