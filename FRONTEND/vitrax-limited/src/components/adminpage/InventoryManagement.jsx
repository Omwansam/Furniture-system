import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaBox, FaWarehouse, FaTruck, FaDownload, FaFilter, FaEye, FaBarcode } from 'react-icons/fa';
import './InventoryManagement.css';

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

  // Mock inventory data
  const mockInventory = [
    {
      id: 1,
      sku: 'MSS-001',
      name: 'Modern Sofa Set',
      category: 'Living Room',
      currentStock: 15,
      minStock: 5,
      maxStock: 50,
      unitCost: 1200,
      unitPrice: 2499,
      supplier: 'Comfort Furniture Co.',
      location: 'Warehouse A - Section 1',
      lastRestocked: '2024-01-10',
      status: 'In Stock'
    },
    {
      id: 2,
      sku: 'ODT-002',
      name: 'Oak Dining Table',
      category: 'Dining Room',
      currentStock: 3,
      minStock: 5,
      maxStock: 25,
      unitCost: 650,
      unitPrice: 1299,
      supplier: 'Wood Masters Ltd.',
      location: 'Warehouse B - Section 2',
      lastRestocked: '2024-01-05',
      status: 'Low Stock'
    },
    {
      id: 3,
      sku: 'LR-003',
      name: 'Leather Recliner',
      category: 'Living Room',
      currentStock: 0,
      minStock: 5,
      maxStock: 20,
      unitCost: 450,
      unitPrice: 899,
      supplier: 'Luxury Seating Inc.',
      location: 'Warehouse A - Section 3',
      lastRestocked: '2023-12-20',
      status: 'Out of Stock'
    },
    {
      id: 4,
      sku: 'CT-004',
      name: 'Coffee Table',
      category: 'Living Room',
      currentStock: 25,
      minStock: 10,
      maxStock: 40,
      unitCost: 150,
      unitPrice: 399,
      supplier: 'Modern Furniture Co.',
      location: 'Warehouse A - Section 2',
      lastRestocked: '2024-01-12',
      status: 'In Stock'
    },
    {
      id: 5,
      sku: 'BS-005',
      name: 'Bookshelf',
      category: 'Office',
      currentStock: 8,
      minStock: 5,
      maxStock: 30,
      unitCost: 200,
      unitPrice: 599,
      supplier: 'Storage Solutions Ltd.',
      location: 'Warehouse B - Section 1',
      lastRestocked: '2024-01-08',
      status: 'In Stock'
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setInventory(mockInventory);
      
      // Calculate stats
      const stats = {
        totalItems: mockInventory.length,
        lowStock: mockInventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length,
        outOfStock: mockInventory.filter(item => item.currentStock === 0).length,
        totalValue: mockInventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
      };
      setInventoryStats(stats);
      setLoading(false);
    }, 1000);
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
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const paginatedInventory = sortedInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedInventory.length / itemsPerPage);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> Add Item
          </button>
          <button className="btn btn-secondary">
            <FaDownload /> Export
          </button>
          <button className="btn btn-secondary">
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
            <option value="Living Room">Living Room</option>
            <option value="Dining Room">Dining Room</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Office">Office</option>
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
                      onClick={() => {
                        setSelectedItem(item);
                        setShowEditModal(true);
                      }}
                      title="Edit Item"
                    >
                      <FaEdit />
                    </button>
                    <button className="btn-icon" title="View Details">
                      <FaEye />
                    </button>
                    <button className="btn-icon delete" title="Delete Item">
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
                  <button className="restock-btn">
                    <FaTruck /> Restock
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
