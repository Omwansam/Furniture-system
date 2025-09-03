import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaStar, 
  FaTimes, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDownload, 
  FaUpload, 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaFileExport, 
  FaFileImport,
  FaBox,
  FaBoxes,
  FaExclamationCircle,
  FaDollarSign,
  FaChartLine,
  FaCog,
  FaImage,
  FaCamera,
  FaTrashAlt,
  FaSave,
  FaUndo,
  FaCheck,
  FaBan,
  FaEyeSlash,
  FaStarHalfAlt,
  FaHeart,
  FaShoppingCart,
  FaUsers,
  FaClipboardList,
  FaTruck,
  FaCreditCard,
  FaShieldAlt,
  FaBell,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaRuler,
  FaPalette,
  FaQuestion,
  FaPaperPlane,
  FaEllipsisH
} from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import { productService } from '../../services/adminService';
import './ProductManagement.css';

const ProductManagement = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy] = useState("product_name");
  const [sortOrder] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [categories, setCategories] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionMenu && !event.target.closest('.action-menu')) {
        setActiveActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeActionMenu]);

  // Form state
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    product_description: "",
    product_price: 0,
    stock_quantity: 0,
    category_id: "",
    images: []
  });

  const statuses = ["All", "Active", "Low Stock", "Out of Stock", "Inactive"];

  // Helper functions - moved to top to avoid hoisting issues
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
    if (stock === 0) return { status: "Out of Stock", color: "text-red", icon: <FaExclamationCircle /> };
    if (stock <= 5) return { status: "Low Stock", color: "text-orange", icon: <FaExclamationTriangle /> };
    return { status: "In Stock", color: "text-green", icon: <FaCheckCircle /> };
  };

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
  const totalValue = products.reduce((sum, p) => sum + (p.product_price * p.stock_quantity), 0);

  // Image handling functions
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + uploadedImages.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const newImages = files.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages([...uploadedImages, ...newImages]);
    setImagePreviewUrls([...imagePreviewUrls, ...newImages.map(img => img.preview)]);
  };

  const removeImage = (imageId) => {
    const imageToRemove = uploadedImages.find(img => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    setUploadedImages(uploadedImages.filter(img => img.id !== imageId));
    setImagePreviewUrls(imagePreviewUrls.filter((_, index) => 
      uploadedImages.findIndex(img => img.id === imageId) !== index
    ));
  };

  // CRUD operations
  const handleAddProduct = async () => {
    if (!newProduct.product_name || !newProduct.product_price || !newProduct.category_id) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('product_name', newProduct.product_name);
      formData.append('product_description', newProduct.product_description);
      formData.append('product_price', newProduct.product_price);
      formData.append('stock_quantity', newProduct.stock_quantity);
      formData.append('category_id', newProduct.category_id);

      // Add images
      uploadedImages.forEach((image) => {
        formData.append('images', image.file);
      });

      await productService.createProduct(formData);
      await fetchProducts();
      
      // Reset form
      setNewProduct({
        product_name: "",
        product_description: "",
        product_price: 0,
        stock_quantity: 0,
        category_id: "",
        images: []
      });
      setUploadedImages([]);
      setImagePreviewUrls([]);
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
      const formData = new FormData();
      formData.append('product_name', editingProduct.product_name);
      formData.append('product_description', editingProduct.product_description);
      formData.append('product_price', editingProduct.product_price);
      formData.append('stock_quantity', editingProduct.stock_quantity);
      formData.append('category_id', editingProduct.category_id);

      // Add new images
      uploadedImages.forEach((image) => {
        formData.append('images', image.file);
      });

      await productService.updateProduct(editingProduct.product_id, formData);
      await fetchProducts();
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      setUploadedImages([]);
      setImagePreviewUrls([]);
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

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
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
          <h1 className="header-title">Products</h1>
          <p className="header-subtitle">Manage and track your furniture catalog</p>
        </div>
        <div className="product-actions">
          <button className="btn btn-outline" onClick={() => fetchProducts()}>
            <FiRefreshCw /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddDialogOpen(true)}>
            <FaPlus /> + Create Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaBoxes />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalProducts}</div>
            <div className="stat-label">Total Products</div>
            <div className="stat-change positive">+15% from last month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <div className="stat-value">Ksh {totalValue.toLocaleString()}</div>
            <div className="stat-label">Total Value</div>
            <div className="stat-change positive">+12% from last month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon low-stock">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{lowStockProducts}</div>
            <div className="stat-label">Low Stock</div>
            <div className="stat-change negative">-8% from last month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon out-of-stock">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{Math.round((activeProducts / totalProducts) * 100)}%</div>
            <div className="stat-label">Active Rate</div>
            <div className="stat-change positive">+3% from last month</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name or description..."
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
            <option value="all">All Status</option>
            {statuses.map((stat) => (
              <option key={stat} value={stat.toLowerCase()}>
                {stat}
              </option>
            ))}
          </select>

          <button className="btn btn-outline filter-btn">
            <FaFilter /> More Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">
            <FaCheckCircle /> {selectedProducts.length} products selected
          </span>
          <button className="btn btn-secondary" onClick={() => handleBulkAction("activate")}>
            <FaCheck /> Activate
          </button>
          <button className="btn btn-secondary" onClick={() => handleBulkAction("deactivate")}>
            <FaBan /> Deactivate
          </button>
          <button className="btn btn-danger" onClick={() => handleBulkAction("delete")}>
            <FaTrash /> Delete
          </button>
          <button className="btn btn-clear" onClick={() => setSelectedProducts([])}>
            <FaTimes /> Clear
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
              <th>PRODUCT</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
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
                        src={product.primary_image || product.images?.[0]?.image_url || "/placeholder.svg"} 
                        alt={product.product_name}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="product-details">
                        <div className="product-name">{product.product_name}</div>
                        <div className="product-id">PROD-{String(product.product_id).padStart(3, '0')}</div>
                      </div>
                    </div>
                  </td>

                  <td>{category?.category_name || 'Unknown'}</td>
                  <td>Ksh {product.product_price?.toLocaleString()}</td>
                  <td>
                    <span className={`stock-status ${stockInfo.color}`}>
                      {product.stock_quantity} items
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${getStatusVariant(status)}`}>
                      {status === 'Active' ? <FaCheckCircle /> : <FaTimes />} {status}
                    </span>
                  </td>
                  <td>
                    <div className="action-menu">
                      <button 
                        className="action-menu-btn" 
                        onClick={() => setActiveActionMenu(product.product_id)}
                        title="More actions"
                      >
                        <FaEllipsisH />
                      </button>
                      {activeActionMenu === product.product_id && (
                        <>
                          <div className="action-sidebar-backdrop" onClick={() => setActiveActionMenu(null)}></div>
                          <div className="action-sidebar">
                          <div className="action-sidebar-header">
                            <h3>Actions</h3>
                            <button 
                              className="close-sidebar"
                              onClick={() => setActiveActionMenu(null)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                          <div className="action-sidebar-content">
                            <button 
                              className="action-sidebar-item" 
                              onClick={() => {
                                handleViewProduct(product);
                                setActiveActionMenu(null);
                              }}
                            >
                              <FaEye />
                              <span>View Details</span>
                            </button>
                            <button 
                              className="action-sidebar-item" 
                              onClick={() => {
                                setEditingProduct({ ...product });
                                setIsEditDialogOpen(true);
                                setActiveActionMenu(null);
                              }}
                            >
                              <FaEdit />
                              <span>Edit Product</span>
                            </button>
                            <button 
                              className="action-sidebar-item" 
                              onClick={() => {
                                handleExport();
                                setActiveActionMenu(null);
                              }}
                            >
                              <FaDownload />
                              <span>Download</span>
                            </button>
                            <button 
                              className="action-sidebar-item" 
                              onClick={() => {
                                handleViewProduct(product);
                                setActiveActionMenu(null);
                              }}
                            >
                              <FaPaperPlane />
                              <span>Send</span>
                            </button>
                            <button 
                              className="action-sidebar-item danger" 
                              onClick={() => {
                                handleDeleteProduct(product.product_id);
                                setActiveActionMenu(null);
                              }}
                            >
                              <FaTrash />
                              <span>Delete Product</span>
                            </button>
                          </div>
                        </div>
                      </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {paginatedProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <FaBoxes />
            </div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={() => setIsAddDialogOpen(true)}>
              <FaPlus /> Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Pagination with Numbered Pages */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <span className="pagination-info">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} results • Page {currentPage} of {totalPages}
          </span>
          <div className="pagination-controls">
            {/* Previous button - only show if not on first page */}
            {currentPage > 1 && (
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(currentPage - 1)}
                title="Previous page"
              >
                ← Previous
              </button>
            )}
            
            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              
              // Show all pages if total pages <= 7
              if (totalPages <= 7) {
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              
              // For more than 7 pages, show smart pagination
              if (
                pageNum === 1 || // Always show first page
                pageNum === totalPages || // Always show last page
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) || // Show pages around current
                (currentPage <= 3 && pageNum <= 5) || // Show first 5 pages when near start
                (currentPage >= totalPages - 2 && pageNum >= totalPages - 4) // Show last 5 pages when near end
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              
              // Show ellipsis
              if (
                (pageNum === 2 && currentPage > 4) ||
                (pageNum === totalPages - 1 && currentPage < totalPages - 3)
              ) {
                return <span key={`ellipsis-${pageNum}`} className="pagination-ellipsis">...</span>;
              }
              
              return null;
            })}
            
            {/* Next button - only show if not on last page */}
            {currentPage < totalPages && (
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(currentPage + 1)}
                title="Next page"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Product Dialog */}
      {isAddDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">
                <h2><FaPlus /> Add New Product</h2>
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
                    Product Images (Max 10)
                    <div className="image-upload-area">
                      <FaUpload className="upload-icon" />
                      <p>Drag and drop images here or click to browse</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    
                    {uploadedImages.length > 0 && (
                      <div className="image-previews">
                        {uploadedImages.map((image) => (
                          <div key={image.id} className="image-preview">
                            <img src={image.preview} alt="Preview" />
                            <button
                              type="button"
                              className="remove-image"
                              onClick={() => removeImage(image.id)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </label>
                </div>
              )}

              <div className="dialog-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
                  <FaSave /> Create Product
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
                <h2><FaEdit /> Edit Product</h2>
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
                    Product Images (Max 10)
                    <div className="image-upload-area">
                      <FaUpload className="upload-icon" />
                      <p>Drag and drop images here or click to browse</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    
                    {uploadedImages.length > 0 && (
                      <div className="image-previews">
                        {uploadedImages.map((image) => (
                          <div key={image.id} className="image-preview">
                            <img src={image.preview} alt="Preview" />
                            <button
                              type="button"
                              className="remove-image"
                              onClick={() => removeImage(image.id)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </label>
                </div>
              )}

              <div className="dialog-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditProduct}>
                  <FaSave /> Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Dialog */}
      {isViewDialogOpen && viewingProduct && (
        <div className="dialog-overlay">
          <div className="dialog-content view-dialog">
            <div className="dialog-header">
              <div className="dialog-title">
                <h2><FaEye /> Product Details</h2>
                <p>View product information</p>
              </div>
              <button
                className="close-dialog"
                onClick={() => setIsViewDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="product-view-content">
              <div className="product-images">
                <img 
                  src={viewingProduct.primary_image || viewingProduct.images?.[0]?.image_url || "/placeholder.svg"} 
                  alt={viewingProduct.product_name}
                  className="main-product-image"
                />
              </div>
              
              <div className="product-details-view">
                <h3>{viewingProduct.product_name}</h3>
                <p className="product-description">{viewingProduct.product_description}</p>
                
                <div className="product-stats">
                  <div className="stat">
                    <span className="label">Price:</span>
                    <span className="value">${viewingProduct.product_price?.toFixed(2)}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Stock:</span>
                    <span className="value">{viewingProduct.stock_quantity}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Category:</span>
                    <span className="value">
                      {categories.find(c => c.category_id === viewingProduct.category_id)?.category_name || 'Unknown'}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">Status:</span>
                    <span className={`value status-${getStatusVariant(getProductStatus(viewingProduct))}`}>
                      {getProductStatus(viewingProduct)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  setEditingProduct({ ...viewingProduct });
                  setIsViewDialogOpen(false);
                  setIsEditDialogOpen(true);
                }}
              >
                <FaEdit /> Edit Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
