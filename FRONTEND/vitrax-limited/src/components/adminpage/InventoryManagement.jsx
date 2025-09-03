import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaBox, FaWarehouse, FaTruck, FaDownload, FaFilter, FaEye, FaBarcode } from 'react-icons/fa';
import './InventoryManagement.css';
import { productService, categoryService } from '../../services/adminService';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  const mapProductToInventoryItem = (p) => {
    return {
      id: p.product_id,
      sku: p.sku || `SKU-${p.product_id}`,
      name: p.product_name,
      category: p.category_name || 'Uncategorized',
      currentStock: Number(p.stock_quantity || 0),
      minStock: 5,
      maxStock: 100,
      unitCost: Number(p.unit_cost || (Number(p.product_price || 0) * 0.6)),
      unitPrice: Number(p.product_price || 0),
      supplier: p.supplier || 'Default Supplier',
      location: p.location || 'Main Warehouse',
      lastRestocked: p.updated_at || p.created_at || new Date().toISOString(),
      status: (p.stock_quantity === 0) ? 'Out of Stock' : (p.stock_quantity <= 5 ? 'Low Stock' : 'In Stock')
    };
  };

  const refreshInventory = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts({ per_page: 200 }),
        categoryService.getAllCategories().catch(() => [])
      ]);

      const items = (Array.isArray(productsRes) ? productsRes : []).map(mapProductToInventoryItem);
      setInventory(items);

      const stats = {
        totalItems: items.length,
        lowStock: items.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length,
        outOfStock: items.filter(item => item.currentStock === 0).length,
        totalValue: items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
      };
      setInventoryStats(stats);

      if (categoriesRes && Array.isArray(categoriesRes.categories)) {
        setCategories(categoriesRes.categories);
      } else if (Array.isArray(categoriesRes)) {
        setCategories(categoriesRes);
      } else {
        setCategories([]);
      }
    } catch (e) {
      console.error('Failed to load inventory:', e);
      setInventory([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "in-stock" && item.currentStock > item.minStock) ||
      (stockFilter === "low-stock" && item.currentStock <= item.minStock && item.currentStock > 0) ||
      (stockFilter === "out-of-stock" && item.currentStock === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (sortOrder === 'asc') {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  });

  const paginatedInventory = sortedInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedInventory.length / itemsPerPage) || 1;

  const getStatusBadge = (item) => {
    if (item.currentStock === 0) {
      return <span className="status-badge out-of-stock">Out of Stock</span>;
    } else if (item.currentStock <= item.minStock) {
      return <span className="status-badge low-stock">Low Stock</span>;
    } else {
      return <span className="status-badge in-stock">In Stock</span>;
    }
  };

  const getStockLevel = (item) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    return Math.min(percentage, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleExport = async () => {
    try {
      const data = await productService.exportProducts();
      const rows = data.csv_data || [];
      if (!rows.length) return;
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = (data.filename || 'products_export.csv');
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete product "${item.name}"? This cannot be undone.`)) return;
    try {
      await productService.deleteProduct(item.id);
      await refreshInventory();
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleRestock = async (item) => {
    try {
      const newQty = Math.max(item.minStock + 5, item.currentStock + 10);
      await productService.updateProduct(item.id, { stock_quantity: newQty });
      await refreshInventory();
    } catch (e) {
      console.error('Restock failed:', e);
    }
  };

  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    product_price: 0,
    stock_quantity: 0,
    category_id: ''
  });

  const openAddModal = () => {
    setFormData({ product_name: '', product_description: '', product_price: 0, stock_quantity: 0, category_id: '' });
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      product_name: item.name,
      product_description: '',
      product_price: item.unitPrice,
      stock_quantity: item.currentStock,
      category_id: ''
    });
    setShowEditModal(true);
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await productService.createProduct(formData);
      setShowAddModal(false);
      await refreshInventory();
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setSaving(true);
    try {
      await productService.updateProduct(selectedItem.id, formData);
      setShowEditModal(false);
      setSelectedItem(null);
      await refreshInventory();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="inventory-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <FaPlus /> Add Item
          </button>
          <button className="btn btn-secondary" onClick={handleExport}>
            <FaDownload /> Export
          </button>
          <button className="btn btn-secondary" onClick={refreshInventory}>
            <FaTruck /> Restock Orders
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
            <h3>{inventoryStats.totalItems}</h3>
            <p>Total Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <h3>{inventoryStats.lowStock}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger">
            <FaWarehouse />
          </div>
          <div className="stat-info">
            <h3>{inventoryStats.outOfStock}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon value">
            <FaBarcode />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(inventoryStats.totalValue)}</h3>
            <p>Total Inventory Value</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="inventory-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.category_id || c.id} value={c.category_name || c.name}>
                {c.category_name || c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-container">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Stock Levels</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="sku">SKU</option>
            <option value="currentStock">Current Stock</option>
            <option value="unitPrice">Price</option>
            <option value="lastRestocked">Last Restocked</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Current Stock</th>
              <th>Min/Max</th>
              <th>Unit Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInventory.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="product-info">
                    <div className="product-name">{item.name}</div>
                    <div className="product-supplier">{item.supplier}</div>
                  </div>
                </td>
                <td>
                  <span className="sku-code">{item.sku}</span>
                </td>
                <td>{item.category}</td>
                <td>
                  <div className="stock-level">
                    <div className="stock-bar">
                      <div 
                        className="stock-fill" 
                        style={{ width: `${getStockLevel(item)}%` }}
                      ></div>
                    </div>
                    <span className="stock-percentage">{Math.round(getStockLevel(item))}%</span>
                  </div>
                </td>
                <td>
                  <span className={`stock-number ${item.currentStock <= item.minStock ? 'low' : ''}`}>
                    {item.currentStock}
                  </span>
                </td>
                <td>
                  <div className="min-max">
                    <span>Min: {item.minStock}</span>
                    <span>Max: {item.maxStock}</span>
                  </div>
                </td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td>
                  <span className="location">{item.location}</span>
                </td>
                <td>{getStatusBadge(item)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => openEditModal(item)}
                      title="Edit Item"
                    >
                      <FaEdit />
                    </button>
                    <button className="btn-icon" title="View Details">
                      <FaEye />
                    </button>
                    <button className="btn-icon delete" title="Delete Item" onClick={() => handleDelete(item)}>
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

      {/* Low Stock Alerts */}
      {inventoryStats.lowStock > 0 && (
        <div className="alerts-section">
          <h3><FaExclamationTriangle /> Low Stock Alerts</h3>
          <div className="alerts-list">
            {inventory
              .filter(item => item.currentStock <= item.minStock && item.currentStock > 0)
              .map(item => (
                <div key={item.id} className="alert-item">
                  <div className="alert-info">
                    <span className="alert-product">{item.name}</span>
                    <span className="alert-sku">{item.sku}</span>
                  </div>
                  <div className="alert-stock">
                    <span className="current">{item.currentStock}</span>
                    <span className="min">Min: {item.minStock}</span>
                  </div>
                  <button className="restock-btn" onClick={() => handleRestock(item)}>
                    <FaTruck /> Restock
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Product</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={submitAdd} className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.product_description} onChange={(e) => setFormData({ ...formData, product_description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" step="0.01" value={formData.product_price} onChange={(e) => setFormData({ ...formData, product_price: Number(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}>
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.category_id || c.id} value={c.category_id || c.id}>
                      {c.category_name || c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={submitEdit} className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.product_description} onChange={(e) => setFormData({ ...formData, product_description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" step="0.01" value={formData.product_price} onChange={(e) => setFormData({ ...formData, product_price: Number(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}>
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.category_id || c.id} value={c.category_id || c.id}>
                      {c.category_name || c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
