import React from 'react'
import {useState} from "react"
import './ProductManagement.css'
import { FaCheckCircle, FaExclamationTriangle, FaStar, FaTimes } from 'react-icons/fa';


const ProductManagement = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10)


  const [products, setProducts] = useState([
    {
      id: "PRD-001",
      name: "Modern Sofa Set",
      category: "Living Room",
      price: 2499,
      cost: 1200,
      stock: 15,
      minStock: 5,
      status: "Active",
      image: "/placeholder.svg?height=200&width=200",
      description: "Comfortable 3-seater sofa with premium fabric upholstery and solid wood frame",
      sku: "MSS-001",
      weight: 85,
      dimensions: "220cm x 90cm x 85cm",
      material: "Premium Fabric, Solid Wood",
      color: "Charcoal Gray",
      supplier: "Comfort Furniture Co.",
      tags: ["bestseller", "premium", "modern"],
      rating: 4.8,
      reviews: 124,
      sold: 89,
      featured: true,
      createdAt: "2023-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "PRD-002",
      name: "Oak Dining Table",
      category: "Dining Room",
      price: 1299,
      cost: 650,
      stock: 8,
      minStock: 3,
      status: "Active",
      image: "/placeholder.svg?height=200&width=200",
      description: "Solid oak dining table for 6 people with natural finish",
      sku: "ODT-002",
      weight: 45,
      dimensions: "180cm x 90cm x 75cm",
      material: "Solid Oak Wood",
      color: "Natural Oak",
      supplier: "Wood Masters Ltd.",
      tags: ["natural", "dining", "oak"],
      rating: 4.6,
      reviews: 87,
      sold: 56,
      featured: false,
      createdAt: "2023-02-20",
      updatedAt: "2024-01-10",
    },
    {
      id: "PRD-003",
      name: "Leather Recliner",
      category: "Living Room",
      price: 899,
      cost: 450,
      stock: 0,
      minStock: 5,
      status: "Out of Stock",
      image: "/placeholder.svg?height=200&width=200",
      description: "Premium leather reclining chair with massage function",
      sku: "LR-003",
      weight: 35,
      dimensions: "100cm x 95cm x 110cm",
      material: "Genuine Leather, Steel Frame",
      color: "Brown",
      supplier: "Luxury Seating Inc.",
      tags: ["luxury", "leather", "recliner"],
      rating: 4.9,
      reviews: 203,
      sold: 145,
      featured: true,
      createdAt: "2023-03-10",
      updatedAt: "2024-01-08",
    },
    {
      id: "PRD-004",
      name: "Office Chair",
      category: "Office",
      price: 299,
      cost: 150,
      stock: 25,
      minStock: 10,
      status: "Active",
      image: "/placeholder.svg?height=200&width=200",
      description: "Ergonomic office chair with lumbar support and adjustable height",
      sku: "OC-004",
      weight: 18,
      dimensions: "65cm x 65cm x 120cm",
      material: "Mesh, Plastic, Steel",
      color: "Black",
      supplier: "ErgoWork Solutions",
      tags: ["ergonomic", "office", "adjustable"],
      rating: 4.4,
      reviews: 156,
      sold: 234,
      featured: false,
      createdAt: "2023-04-05",
      updatedAt: "2024-01-12",
    },
    {
      id: "PRD-005",
      name: "Bookshelf Unit",
      category: "Storage",
      price: 599,
      cost: 300,
      stock: 12,
      minStock: 8,
      status: "Active",
      image: "/placeholder.svg?height=200&width=200",
      description: "5-tier wooden bookshelf unit with adjustable shelves",
      sku: "BSU-005",
      weight: 28,
      dimensions: "80cm x 30cm x 180cm",
      material: "Engineered Wood",
      color: "White",
      supplier: "Storage Solutions Co.",
      tags: ["storage", "bookshelf", "adjustable"],
      rating: 4.7,
      reviews: 92,
      sold: 67,
      featured: false,
      createdAt: "2023-05-12",
      updatedAt: "2024-01-14",
    },
    {
      id: "PRD-006",
      name: "Office Chair",
      category: "Office",
      price: 299,
      cost: 150,
      stock: 25,
      minStock: 10,
      status: "Active",
      image: "/placeholder.svg?height=200&width=200",
      description: "Ergonomic office chair with lumbar support and adjustable height",
      sku: "OC-004",
      weight: 18,
      dimensions: "65cm x 65cm x 120cm",
      material: "Mesh, Plastic, Steel",
      color: "Black",
      supplier: "ErgoWork Solutions",
      tags: ["ergonomic", "office", "adjustable"],
      rating: 4.4,
      reviews: 156,
      sold: 234,
      featured: false,
      createdAt: "2023-04-05",
      updatedAt: "2024-01-12",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    description: "",
    sku: "",
    weight: 0,
    dimensions: "",
    material: "",
    color: "",
    supplier: "",
    tags: [],
    featured: false,
  });

  const categories = ["All", "Living Room", "Dining Room", "Bedroom", "Office", "Storage", "Outdoor"];
  const statuses = ["All", "Active", "Inactive", "Out of Stock", "Discontinued"];


  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" ||  product.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || product.status ===selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus  
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (sortOrder ==="asc") return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    else return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "Active").length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock && p.stock > 0). length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

 const handleAddProduct = () => {
  if(!newProduct.name || !newProduct.category || !newProduct.price){
    alert("Please fill in all required fields");
    return;
  }

  const product = {
      id: `PRD-${String(products.length + 1).padStart(3, "0")}`,
      name: newProduct.name,
      category: newProduct.category,
      price: newProduct.price,
      cost: newProduct.cost || 0,
      stock: newProduct.stock || 0,
      minStock: newProduct.minStock || 0,
      status: newProduct.stock > 0 ? "Active" : "Out of Stock",
      image: "/placeholder.svg?height=200&width=200",
      description: newProduct.description || "",
      sku: newProduct.sku || `SKU-${Date.now()}`,
      weight: newProduct.weight || 0,
      dimensions: newProduct.dimensions || "",
      material: newProduct.material || "",
      color: newProduct.color || "",
      supplier: newProduct.supplier || "",
      tags: newProduct.tags || [],
      rating: 0,
      reviews: 0,
      sold: 0,
      featured: newProduct.featured || false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setProducts([...products, product]);
    setNewProduct({
      name: "",
      category: "",
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      description: "",
      sku: "",
      weight: 0,
      dimensions: "",
      material: "",
      color: "",
      supplier: "",
      tags: [],
      featured: false,
    });
    setIsAddDialogOpen(false);
    alert("Product added successfully");
 };
 
 const handleEditProduct = () => {
    if (!editingProduct) return;
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id ? { ...editingProduct, updatedAt: new Date().toISOString().split("T")[0] } : p
      )
    );
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    alert("Product updated successfully");
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
    alert("Product deleted successfully");
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case "delete":
        setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);
        alert(`${selectedProducts.length} products deleted`);
        break;
      case "activate":
        setProducts(products.map((p) => (selectedProducts.includes(p.id) ? { ...p, status: "Active" } : p)));
        setSelectedProducts([]);
        alert(`${selectedProducts.length} products activated`);
        break;
      case "deactivate":
        setProducts(products.map((p) => (selectedProducts.includes(p.id) ? { ...p, status: "Inactive" } : p)));
        setSelectedProducts([]);
        alert(`${selectedProducts.length} products deactivated`);
        break;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Out of Stock":
        return "destructive";
      case "Discontinued":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStockStatus = (stock, minStock) => {
    if (stock === 0)
      return { status: "Out of Stock", color: "text-red", icon: <FaExclamationTriangle /> };
    if (stock <= minStock)
      return { status: "Low Stock", color: "text-orange", icon: <FaExclamationTriangle /> };
    return { status: "In Stock", color: "text-green", icon: <FaCheckCircle /> };
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };
  return (
    <div className='product-management'>
      {/**Header */}
      <div className='product-header'>
        <div className='header-details'>
          <h1 className='header-title'>Product Management</h1>
          <p className='header-subtitle'>Manage your furniture and product catalog</p>
        </div>
        <div className='product-btn'>
          <button className='btn btn-outline'>Import</button>
          <button className='btn btn-outline'>Export</button>
          <button className='btn btn-primary' onClick={() => setIsAddDialogOpen(true)}>
            Add Product
          </button>
        </div>
      </div>

      {/**Stats Cards */}
      <div className='stats-cards'>
        <div className='card'>
          <div className='card-header'>Total Products</div>
          <div className='card-value'>{totalProducts}</div>
          <div className='card-subtext'> In Catalog</div>
        </div>

        <div className='card'>
          <div className='card-header'>Total Products</div>
          <div className='card-value'>{activeProducts}</div>
          <div className='card-subtext'> In Catalog</div>
        </div>

        <div className='card'>
          <div className='card-header'>Low Stock</div>
          <div className='card-value'>{lowStockProducts}</div>
          <div className='card-subtext'>Available for sale</div>
        </div>

        <div className='card'>
          <div className='card-header'>Out of Stock</div>
          <div className='card-value'>{outOfStockProducts}</div>
          <div className='card-subtext'> Unavailable</div>
        </div>
        <div className="card">
          <div className="card-header">Total Value</div>
          <div className="card-value">${totalValue.toLocaleString()}</div>
          <div className="card-subtext">Inventory value</div>
        </div>
      </div>

      {/**Filters */}
      <div className='card-content'>
        <div className='card-title'>Product Catalog</div>
        <div className='card-description'>Browse and manage your furniture</div>
        <div className='content-header'>
          <input
            type='text'
            placeholder='Search products ....'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='input'
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input"
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
            className="input"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="createdAt">Sort by Date</option>
          </select>
        </div>


        {/**Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bulk-actions">
            <span className='selected-count'>{selectedProducts.length} products selected</span>
            <button className='btns btn-secondary' onClick={() => handleBulkAction("activate")}>Activate</button>
            <button className='btns btn-secondary' onClick={() => handleBulkAction("deactivate")}>Deactivate</button>
            <button className='btns btn-danger' onClick={() => handleBulkAction("delete")} >
              Delete
            </button>
            <button className='btns btn-clear' onClick={() => setSelectedProducts([])}>Clear</button>
          </div>
        )}

        {/**Product Table */}
        <table className='product-table'>
          <thead>
            <tr>
              <th>
                <input 
                  type='checkbox'
                  checked={selectedProducts.length === paginatedProducts.length}
                  onChange={toggleSelectAll}
                />
                </th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product) => {
              const stockInfo = getStockStatus(product.stock, product.minStock);
              return (
                <tr key={product.id}>
                  <td>
                    <input
                      type='checkbox'
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                        }
                      }}
                    />
                  </td>

                  <td>
                    <div className='product-info'>
                      <img className='product-thumbnail' src={product.image} alt={product.name}  />
                      <div className='product-feature'>
                        <div className='product-name'>{product.name}</div>
                        <small className='product-sku'>{product.sku}</small>
                        
                        {product.featured && <span className='featured-badge'>Featured</span>}
                        
                      </div>
                    </div>
                  </td>

                  <td>{product.category}</td>
                  <td>Ksh {product.price.toFixed(2)}</td>
                  <td>
                    <span className={stockInfo.color}>{stockInfo.icon} {product.stock}</span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusVariant(product.status)}`}>
                      {product.status}
                      </span>
                  </td>
                  <td>
                    <div>{product.rating} <FaStar className='rating-icon'/> ({product.reviews})</div>
                    <small>{product.sold} sold</small>
                  </td>
                  <td >
                    <div className='actions-buttons'>
                    <button className='action-btn btn-view' onClick={() => alert("View details")}>View</button>
                    <button className='action-btn btn-edit' onClick={() => {
                      setEditingProduct({ ...product });
                      setIsEditDialogOpen(true);
                    }}>Edit</button>
                    <button className="action-btn btns-danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination-container ">
          <span className='pagination-info'>
            Showing {paginatedProducts.length} of {sortedProducts.length} results
          </span>
          <div className='pagination-controls'>
            <button className='pagination-btn' disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
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
            <button className='pagination-btn' disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>



      {/**Add Product Dialog */}
      {isAddDialogOpen && (
        <div className='dialog-overlay'>
          <div className='dialog-content'>
            <div className='dialog-header'>
              <div className='dialog-title'>
            <h2>Add New Product</h2>
            <p>Create a new product in your furniture catalog</p>
              </div>


            {/**Close Icon Button */}
            <button
              className='close-dialog'
              onClick={() => setIsAddDialogOpen(false)}
            >
              <FaTimes/>
            </button>
            </div>


            {/* Tabs */}
            <div className='tab-buttons'>
              {['Basic Info', 'Details', 'Inventory'].map((tab, index) => (
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
              {/* ===Basic Info Tab*/}
              {activeTab === 0 && (
                <div className='form-grid'>
                  <label>
                    Product Name *
                    <input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct,name: e.target.value})}
                    />
                  </label>

                  <label>
                    SKU
                    <input
                      value={newProduct.sku || ''}
                      placeholder="Auto-generated if empty"
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sku: e.target.value })
                      }
                    />
                  </label>

                  <label>
                    Category *
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value})}
                    >
                      <option value="">Select category</option>
                      {categories.slice(1).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </label>
                  
                  {/** 
                  <label>
                    Supplier

                    <select
                      value={newProduct.supplier || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value})}
                    >
                      <option value="">Select supplier</option>
                      {suppliers?.map((sup) => (
                        <option>
                          {sup.name}
                        </option>
                      ))}
                    </select>
                  </label> **/}


                  <label className="full-width">
                  Description
                    <textarea
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                    />
                  </label>
                </div>
              )}

              {/* === DETAILS TAB === */}
        {activeTab === 1 && (
          <div className="form-grid">
            <label>
              Material
              <input
                value={newProduct.material || ''}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, material: e.target.value })
                }
                placeholder="e.g., Solid Wood, Fabric"
              />
            </label>
            <label>
              Color
              <input
                value={newProduct.color || ''}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, color: e.target.value })
                }
                placeholder="e.g., Brown, White"
              />
            </label>
            <label>
              Dimensions
              <input
                value={newProduct.dimensions || ''}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, dimensions: e.target.value })
                }
                placeholder="L x W x H (cm)"
              />
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                value={newProduct.weight || 0}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, weight: Number(e.target.value) })
                }
              />
            </label>
            <label className="full-width">
              Featured?
              <input
                type="checkbox"
                checked={newProduct.featured || false}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, featured: e.target.checked })
                }
              />
            </label>
          </div>
        )}

              {/* === INVENTORY TAB === */}
        {activeTab === 2 && (
          <div className="form-grid">
            <label>
              Selling Price *
              <input
                type="number"
                value={newProduct.price || 0}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Cost Price
              <input
                type="number"
                value={newProduct.cost || 0}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, cost: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Stock Quantity
              <input
                type="number"
                value={newProduct.stock || 0}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Minimum Stock
              <input
                type="number"
                value={newProduct.minStock || 0}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, minStock: Number(e.target.value) })
                }
              />
            </label>
          </div>
        )}

              
              <div className="dialog-footer">
                <button type="button"  className='button-outlines' onClick={() => setIsAddDialogOpen(false)}>Cancel</button>
                <button type="button" className='button-primary' onClick={handleAddProduct}>Create Product</button>
              </div>
            </form>
          </div>
        </div>
      )}{/** Edit Product Dialog */}
{isEditDialogOpen && editingProduct && (
  <div className="dialog-overlay">
    <div className="dialog-content">
      <div className="dialog-header">
        <div className="dialog-title">
          <h2>Edit Product</h2>
          <p>Modify the details of this product in your furniture catalog</p>
        </div>
        <button
          className="close-dialog"
          onClick={() => setIsEditDialogOpen(false)}
        >
          <FaTimes />
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-buttons">
        {['Basic Info', 'Details', 'Inventory'].map((tab, index) => (
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
        {/* BASIC INFO */}
        {activeTab === 0 && (
          <div className="form-grid">
            <label>
              Product Name *
              <input
                value={editingProduct.name || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </label>
            <label>
              SKU
              <input
                value={editingProduct.sku || ''}
                placeholder="Auto-generated if empty"
                onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
              />
            </label>
            <label>
              Category *
              <select
                value={editingProduct.category || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label className="full-width">
              Description
              <textarea
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              />
            </label>
          </div>
        )}

        {/* DETAILS */}
        {activeTab === 1 && (
          <div className="form-grid">
            <label>
              Material
              <input
                value={editingProduct.material || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                placeholder="e.g., Solid Wood, Fabric"
              />
            </label>
            <label>
              Color
              <input
                value={editingProduct.color || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                placeholder="e.g., Brown, White"
              />
            </label>
            <label>
              Dimensions
              <input
                value={editingProduct.dimensions || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                placeholder="L x W x H (cm)"
              />
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                value={editingProduct.weight || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, weight: Number(e.target.value) })}
              />
            </label>
            <label className="full-width">
              Featured?
              <input
                type="checkbox"
                checked={editingProduct.featured || false}
                onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
              />
            </label>
          </div>
        )}

        {/* INVENTORY */}
        {activeTab === 2 && (
          <div className="form-grid">
            <label>
              Selling Price *
              <input
                type="number"
                value={editingProduct.price || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
              />
            </label>
            <label>
              Cost Price
              <input
                type="number"
                value={editingProduct.cost || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, cost: Number(e.target.value) })}
              />
            </label>
            <label>
              Stock Quantity
              <input
                type="number"
                value={editingProduct.stock || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
              />
            </label>
            <label>
              Minimum Stock
              <input
                type="number"
                value={editingProduct.minStock || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, minStock: Number(e.target.value) })}
              />
            </label>
          </div>
        )}

        <div className="dialog-footer">
          <button type="button" className='button-outlines' onClick={() => setIsEditDialogOpen(false)}>Cancel</button>
          <button type="button" className='button-primary' onClick={handleEditProduct}>Update Product</button>
        </div>
      </form>
    </div>
  </div>
)}




      


      

    </div>
  )
}

export default ProductManagement
