import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaStar, FaTimes, FaPlus, FaEdit, FaTrash, FaEye, FaDownload, FaUpload, FaSearch, FaFilter, FaSort, FaFileExport, FaFileImport } from 'react-icons/fa';
import { productService } from '../../services/adminService';
import './ProductManagement.css';

const ProductManagement = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [categories, setCategories] = useState([]);

  // Form state
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    product_description: "",
    product_price: 0,
    stock_quantity: 0,
    category_id: "",
    images: []
  });

  const statuses = ["All", "Active", "Inactive", "Out of Stock", "Discontinued"];

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Refetch products when filters change
  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm,
        category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        sort_by: sortBy,
        sort_order: sortOrder
      };
      
      const data = await productService.getAllProducts(params);
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // This would need to be implemented in the backend
      // For now, using mock categories
      setCategories([
        { category_id: 1, category_name: "Living Room" },
        { category_id: 2, category_name: "Dining Room" },
        { category_id: 3, category_name: "Bedroom" },
        { category_id: 4, category_name: "Office" },
        { category_id: 5, category_name: "Storage" },
        { category_id: 6, category_name: "Outdoor" }
      ]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category_id?.toString() === selectedCategory;
    const matchesStatus = selectedStatus === "all" || getProductStatus(product) === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortBy] || "";
    const bValue = b[sortBy] || "";
    if (sortOrder === "asc") return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    else return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => getProductStatus(p) === "Active").length;
  const lowStockProducts = products.filter((p) => p.stock_quantity <= 5 && p.stock_quantity > 0).length;
  const outOfStockProducts = products.filter((p) => p.stock_quantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.product_price * p.stock_quantity), 0);

  // Helper functions
  const getProductStatus = (product) => {
    if (product.stock_quantity === 0) return "Out of Stock";
    if (product.stock_quantity <= 5) return "Low Stock";
    return "Active";
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Active": return "success";
      case "Low Stock": return "warning";
      case "Out of Stock": return "danger";
      case "Inactive": return "secondary";
      default: return "secondary";
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: "Out of Stock", color: "text-red", icon: <FaExclamationTriangle /> };
    if (stock <= 5) return { status: "Low Stock", color: "text-orange", icon: <FaExclamationTriangle /> };
    return { status: "In Stock", color: "text-green", icon: <FaCheckCircle /> };
  };

  // CRUD operations
  const handleAddProduct = async () => {
    if (!newProduct.product_name || !newProduct.product_price || !newProduct.category_id) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await productService.createProduct(newProduct);
      await fetchProducts();
      setNewProduct({
        product_name: "",
        product_description: "",
        product_price: 0,
        stock_quantity: 0,
        category_id: "",
        images: []
      });
      setIsAddDialogOpen(false);
      alert("Product added successfully");
    } catch (err) {
      alert("Failed to add product");
      console.error('Error adding product:', err);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      await productService.updateProduct(editingProduct.product_id, editingProduct);
      await fetchProducts();
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      alert("Product updated successfully");
    } catch (err) {
      alert("Failed to update product");
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(productId);
        await fetchProducts();
        alert("Product deleted successfully");
      } catch (err) {
        alert("Failed to delete product");
        console.error('Error deleting product:', err);
      }
    }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      alert("Please select products first");
      return;
    }

    try {
      switch (action) {
        case "delete":
          if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            await productService.bulkDeleteProducts(selectedProducts);
            await fetchProducts();
            setSelectedProducts([]);
            alert(`${selectedProducts.length} products deleted`);
          }
          break;
        case "activate":
          await productService.bulkUpdateProducts(selectedProducts, { status: 'active' });
          await fetchProducts();
          setSelectedProducts([]);
          alert(`${selectedProducts.length} products activated`);
          break;
        case "deactivate":
          await productService.bulkUpdateProducts(selectedProducts, { status: 'inactive' });
          await fetchProducts();
          setSelectedProducts([]);
          alert(`${selectedProducts.length} products deactivated`);
          break;
      }
    } catch (err) {
      alert("Failed to perform bulk action");
      console.error('Error in bulk action:', err);
    }
  };

  // Import/Export functionality
  const handleExport = async () => {
    try {
      const data = await productService.exportProducts();
      
      // Convert to CSV format
      const csvContent = [
        ['ID', 'Name', 'Description', 'Price', 'Stock', 'Category', 'Created', 'Updated'],
        ...data.csv_data.map(p => [
          p.ID,
          p.Name,
          p.Description,
          p.Price,
          p.Stock,
          p.Category,
          p.Created,
          p.Updated
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || `products_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting products:', err);
      alert('Failed to export products');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csv = event.target.result;
          const lines = csv.split('\n');
          
          // Parse CSV and create products
          const importedProducts = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',');
            return {
              product_name: values[1],
              product_description: values[2],
              product_price: parseFloat(values[3]) || 0,
              stock_quantity: parseInt(values[4]) || 0,
              category_id: categories.find(c => c.category_name === values[5])?.category_id || 1
            };
          });

          // Add products one by one
          importedProducts.forEach(async (product) => {
            try {
              await productService.createProduct(product);
            } catch (err) {
              console.error('Error importing product:', err);
            }
          });

          fetchProducts();
          alert(`Imported ${importedProducts.length} products`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(paginatedProducts.map((p) => p.product_id));
    } else {
      setSelectedProducts([]);
    }
  };

  if (loading) {
    return (
      <div className="product-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-management">
      {/* Header */}
      <div className="product-header">
        <div className="header-details">
          <h1 className="header-title">Product Management</h1>
          <p className="header-subtitle">Manage your furniture and product catalog</p>
        </div>
        <div className="product-actions">
          <button className="btn btn-outline" onClick={handleImport}>
            <FaFileImport /> Import
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <FaFileExport /> Export
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddDialogOpen(true)}>
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">📦</div>
          <div className="stat-content">
            <div className="stat-value">{totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">✅</div>
          <div className="stat-content">
            <div className="stat-value">{activeProducts}</div>
            <div className="stat-label">Active Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon low-stock">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{lowStockProducts}</div>
            <div className="stat-label">Low Stock</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon out-of-stock">❌</div>
          <div className="stat-content">
            <div className="stat-value">{outOfStockProducts}</div>
            <div className="stat-label">Out of Stock</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon value">💰</div>
          <div className="stat-content">
            <div className="stat-value">${totalValue.toLocaleString()}</div>
            <div className="stat-label">Total Value</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            {statuses.map((stat) => (
              <option key={stat} value={stat.toLowerCase()}>
                {stat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="product_name">Sort by Name</option>
            <option value="product_price">Sort by Price</option>
            <option value="stock_quantity">Sort by Stock</option>
            <option value="created_at">Sort by Date</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">{selectedProducts.length} products selected</span>
          <button className="btn btn-secondary" onClick={() => handleBulkAction("activate")}>
            Activate
          </button>
          <button className="btn btn-secondary" onClick={() => handleBulkAction("deactivate")}>
            Deactivate
          </button>
          <button className="btn btn-danger" onClick={() => handleBulkAction("delete")}>
            Delete
          </button>
          <button className="btn btn-clear" onClick={() => setSelectedProducts([])}>
            Clear
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox"
                  checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => {
              const stockInfo = getStockStatus(product.stock_quantity);
              const status = getProductStatus(product);
              const category = categories.find(c => c.category_id === product.category_id);
              
              return (
                <tr key={product.product_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.product_id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter((id) => id !== product.product_id));
                        }
                      }}
                    />
                  </td>

                  <td>
                    <div className="product-info">
                      <img 
                        className="product-thumbnail" 
                        src={product.images?.[0]?.image_url || "/placeholder.svg"} 
                        alt={product.product_name}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="product-details">
                        <div className="product-name">{product.product_name}</div>
                        <div className="product-description">
                          {product.product_description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{category?.category_name || 'Unknown'}</td>
                  <td>${product.product_price?.toFixed(2)}</td>
                  <td>
                    <span className={`stock-status ${stockInfo.color}`}>
                      {stockInfo.icon} {product.stock_quantity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${getStatusVariant(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn btn-view" 
                        onClick={() => alert("View details - Implement view modal")}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="action-btn btn-edit" 
                        onClick={() => {
                          setEditingProduct({ ...product });
                          setIsEditDialogOpen(true);
                        }}
                        title="Edit Product"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn btn-delete" 
                        onClick={() => handleDeleteProduct(product.product_id)}
                        title="Delete Product"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {paginatedProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={() => setIsAddDialogOpen(true)}>
              <FaPlus /> Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <span className="pagination-info">
            Showing {paginatedProducts.length} of {sortedProducts.length} results
          </span>
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="pagination-btn" 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Product Dialog */}
      {isAddDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">
                <h2>Add New Product</h2>
                <p>Create a new product in your furniture catalog</p>
              </div>
              <button
                className="close-dialog"
                onClick={() => setIsAddDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="tab-buttons">
              {['Basic Info', 'Details', 'Images'].map((tab, index) => (
                <button
                  key={tab}
                  className={activeTab === index ? 'active' : ''}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {activeTab === 0 && (
                <div className="form-grid">
                  <label>
                    Product Name *
                    <input
                      value={newProduct.product_name}
                      onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </label>

                  <label>
                    Category *
                    <select
                      value={newProduct.category_id}
                      onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Price *
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.product_price}
                      onChange={(e) => setNewProduct({ ...newProduct, product_price: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </label>

                  <label>
                    Stock Quantity
                    <input
                      type="number"
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </label>

                  <label className="full-width">
                    Description
                    <textarea
                      value={newProduct.product_description}
                      onChange={(e) => setNewProduct({ ...newProduct, product_description: e.target.value })}
                      placeholder="Enter product description"
                      rows="4"
                    />
                  </label>
                </div>
              )}

              {activeTab === 1 && (
                <div className="form-grid">
                  <label>
                    SKU
                    <input
                      placeholder="Auto-generated if empty"
                      disabled
                    />
                  </label>
                  <label>
                    Weight (kg)
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                    />
                  </label>
                  <label>
                    Dimensions
                    <input
                      placeholder="L x W x H (cm)"
                    />
                  </label>
                  <label>
                    Material
                    <input
                      placeholder="e.g., Solid Wood, Fabric"
                    />
                  </label>
                  <label>
                    Color
                    <input
                      placeholder="e.g., Brown, White"
                    />
                  </label>
                  <label>
                    Featured Product
                    <input
                      type="checkbox"
                    />
                  </label>
                </div>
              )}

              {activeTab === 2 && (
                <div className="form-grid">
                  <label className="full-width">
                    Product Images
                    <div className="image-upload-area">
                      <FaUpload className="upload-icon" />
                      <p>Drag and drop images here or click to browse</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          // Handle image upload
                          console.log('Images selected:', e.target.files);
                        }}
                      />
                    </div>
                  </label>
                </div>
              )}

              <div className="dialog-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Dialog */}
      {isEditDialogOpen && editingProduct && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">
                <h2>Edit Product</h2>
                <p>Modify the details of this product</p>
              </div>
              <button
                className="close-dialog"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="tab-buttons">
              {['Basic Info', 'Details', 'Images'].map((tab, index) => (
                <button
                  key={tab}
                  className={activeTab === index ? 'active' : ''}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {activeTab === 0 && (
                <div className="form-grid">
                  <label>
                    Product Name *
                    <input
                      value={editingProduct.product_name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, product_name: e.target.value })}
                    />
                  </label>

                  <label>
                    Category *
                    <select
                      value={editingProduct.category_id || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Price *
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.product_price || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, product_price: parseFloat(e.target.value) })}
                    />
                  </label>

                  <label>
                    Stock Quantity
                    <input
                      type="number"
                      value={editingProduct.stock_quantity || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) })}
                    />
                  </label>

                  <label className="full-width">
                    Description
                    <textarea
                      value={editingProduct.product_description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, product_description: e.target.value })}
                      rows="4"
                    />
                  </label>
                </div>
              )}

              {activeTab === 1 && (
                <div className="form-grid">
                  <label>
                    SKU
                    <input
                      value={editingProduct.product_id || ''}
                      disabled
                    />
                  </label>
                  <label>
                    Weight (kg)
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                    />
                  </label>
                  <label>
                    Dimensions
                    <input
                      placeholder="L x W x H (cm)"
                    />
                  </label>
                  <label>
                    Material
                    <input
                      placeholder="e.g., Solid Wood, Fabric"
                    />
                  </label>
                  <label>
                    Color
                    <input
                      placeholder="e.g., Brown, White"
                    />
                  </label>
                  <label>
                    Featured Product
                    <input
                      type="checkbox"
                    />
                  </label>
                </div>
              )}

              {activeTab === 2 && (
                <div className="form-grid">
                  <label className="full-width">
                    Product Images
                    <div className="image-upload-area">
                      <FaUpload className="upload-icon" />
                      <p>Drag and drop images here or click to browse</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          // Handle image upload
                          console.log('Images selected:', e.target.files);
                        }}
                      />
                    </div>
                  </label>
                </div>
              )}

              <div className="dialog-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditProduct}>
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
