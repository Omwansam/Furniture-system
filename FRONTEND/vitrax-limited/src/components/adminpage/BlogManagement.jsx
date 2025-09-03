import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash, 
  FaStar, 
  FaCalendarAlt, 
  FaUser, 
  FaTag, 
  FaFolder,
  FaSearch,
  FaFilter,
  FaSort,
  FaSave,
  FaTimes,
  FaImage,
  FaUpload,
  FaCheck,
  FaBan,
  FaEllipsisH,
  FaPaperPlane,
  FaChartLine
} from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import { blogService } from '../../services/adminService';
import './BlogManagement.css';

const BlogManagement = () => {
  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFeatured, setSelectedFeatured] = useState("all");
  const [sortBy, setSortBy] = useState("date_posted");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [newBlog, setNewBlog] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    is_published: true,
    is_featured: false
  });

  // Fetch blogs and categories from backend
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchBlogStats();
  }, []);

  // Refetch blogs when pagination or filters change
  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, selectedStatus, selectedFeatured, searchTerm, sortBy, sortOrder]);

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setFilterLoading(true);
      }
      
      const response = await blogService.getAllBlogs({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        featured: selectedFeatured !== 'all' ? selectedFeatured : undefined,
        search: searchTerm || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        page: currentPage,
        per_page: itemsPerPage
      });
      if (response.success) {
        setBlogs(response.blogs || []);
        setTotalItems(response.pagination?.total || 0);
      } else {
        console.error('Failed to fetch blogs:', response.error);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    fetchBlogs();
  };

  // Handle filter changes
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1); // Reset to first page
  };

  const handleFeaturedChange = (e) => {
    setSelectedFeatured(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  // Handle toggling featured status
  const handleToggleFeatured = async (blog) => {
    try {
      const formData = new FormData();
      formData.append('is_featured', !blog.is_featured);
      
      const response = await blogService.updateBlog(blog.id, formData);
      if (response.success) {
        // Update the local state to reflect the change
        setBlogs(prevBlogs => 
          prevBlogs.map(b => 
            b.id === blog.id 
              ? { ...b, is_featured: !b.is_featured }
              : b
          )
        );
      } else {
        alert("Failed to update featured status: " + response.error);
      }
    } catch (error) {
      alert("Error updating featured status: " + error.message);
      console.error('Error updating featured status:', error);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await blogService.getBlogCategories();
      if (response.success) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle creating a new blog post
  const handleCreateBlog = async () => {
    if (!newBlog.title || !newBlog.excerpt || !newBlog.content || !newBlog.category) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('excerpt', newBlog.excerpt);
      formData.append('content', newBlog.content);
      formData.append('author', newBlog.author);
      formData.append('category', newBlog.category);
      formData.append('tags', newBlog.tags);
      formData.append('is_published', newBlog.is_published);
      formData.append('is_featured', newBlog.is_featured);

      const response = await blogService.createBlog(formData);
      if (response.success) {
        alert("Blog post created successfully!");
        // Reset form
        setNewBlog({
          title: "",
          excerpt: "",
          content: "",
          author: "",
          category: "",
          tags: "",
          is_published: true,
          is_featured: false
        });
        setIsAddDialogOpen(false);
        // Refresh the blogs list
        fetchBlogs();
      } else {
        alert("Failed to create blog post: " + response.error);
      }
    } catch (error) {
      alert("Error creating blog post: " + error.message);
      console.error('Error creating blog post:', error);
    }
  };

  // Handle opening edit dialog
  const handleEditClick = (blog) => {
    setEditingBlog({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      is_published: blog.is_published,
      is_featured: blog.is_featured
    });
    setIsEditDialogOpen(true);
  };

  // Handle updating a blog post
  const handleUpdateBlog = async () => {
    if (!editingBlog.title || !editingBlog.excerpt || !editingBlog.content || !editingBlog.category) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', editingBlog.title);
      formData.append('excerpt', editingBlog.excerpt);
      formData.append('content', editingBlog.content);
      formData.append('author', editingBlog.author);
      formData.append('category', editingBlog.category);
      formData.append('tags', editingBlog.tags);
      formData.append('is_published', editingBlog.is_published);
      formData.append('is_featured', editingBlog.is_featured);

      const response = await blogService.updateBlog(editingBlog.id, formData);
      if (response.success) {
        alert("Blog post updated successfully!");
        setIsEditDialogOpen(false);
        setEditingBlog(null);
        // Refresh the blogs list
        fetchBlogs();
      } else {
        alert("Failed to update blog post: " + response.error);
      }
    } catch (error) {
      alert("Error updating blog post: " + error.message);
      console.error('Error updating blog post:', error);
    }
  };

  // Handle deleting a blog post
  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const response = await blogService.deleteBlog(blogId);
        if (response.success) {
          alert("Blog post deleted successfully!");
          // Refresh the blogs list
          fetchBlogs();
        } else {
          alert("Failed to delete blog post: " + response.error);
        }
      } catch (error) {
        alert("Error deleting blog post: " + error.message);
        console.error('Error deleting blog post:', error);
      }
    }
  };

  // Handle opening view dialog
  const handleViewClick = (blog) => {
    setViewingBlog(blog);
    setIsViewDialogOpen(true);
  };

  // Calculate statistics
  const totalBlogs = totalItems;
  const publishedBlogs = blogs.filter(b => b.is_published).length;
  const draftBlogs = blogs.filter(b => !b.is_published).length;
  const featuredBlogs = blogs.filter(b => b.is_featured).length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.view_count || 0), 0);

  // Fetch blog statistics from backend
  const fetchBlogStats = async () => {
    try {
      const response = await blogService.getBlogStats();
      if (response.success) {
        // Update stats with real data from backend
        // Note: We'll keep the current stats calculation for now
        // but this can be enhanced to use backend stats
      }
    } catch (error) {
      console.error('Error fetching blog stats:', error);
    }
  };

  // Pagination functions
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus, selectedFeatured, searchTerm, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="blog-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-management">
      {/* Header */}
      <div className="blog-header">
        <div className="header-details">
          <h1 className="header-title">Blog Management</h1>
          <p className="header-subtitle">Create, edit, and manage your blog content</p>
        </div>
        <div className="blog-actions">
          <button className="btn btn-outline" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSelectedStatus('all');
            setSelectedFeatured('all');
            setSortBy('date_posted');
            setSortOrder('desc');
            setCurrentPage(1);
            fetchBlogs();
          }}>
            <FiRefreshCw /> Reset Filters
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddDialogOpen(true)}>
            <FaPlus /> + Create Blog Post
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaPaperPlane />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalBlogs}</div>
            <div className="stat-label">Total Posts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon published">
            <FaCheck />
          </div>
          <div className="stat-content">
            <div className="stat-value">{publishedBlogs}</div>
            <div className="stat-label">Published</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon draft">
            <FaEyeSlash />
          </div>
          <div className="stat-content">
            <div className="stat-value">{draftBlogs}</div>
            <div className="stat-label">Drafts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon featured">
            <FaStar />
          </div>
          <div className="stat-content">
            <div className="stat-value">{featuredBlogs}</div>
            <div className="stat-label">Featured</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon views">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalViews.toLocaleString()}</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="filters-section">
        <div className="search-box">
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search blog posts by title, excerpt, or author..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary search-btn">
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={selectedFeatured}
            onChange={handleFeaturedChange}
            className="filter-select"
          >
            <option value="all">All Featured</option>
            <option value="featured">Featured Only</option>
            <option value="not-featured">Not Featured</option>
          </select>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="filter-select"
          >
            <option value="date_posted">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="view_count">Sort by Views</option>
            <option value="featured">Sort by Featured</option>
          </select>

          <button 
            className="btn btn-outline sort-btn"
            onClick={handleSortOrderChange}
          >
            <FaSort /> {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="table-container">
        {filterLoading && (
          <div className="filter-loading">
            <div className="loading-spinner"></div>
            <span>Updating results...</span>
          </div>
        )}
        <table className="blog-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>BLOG POST</th>
              <th>CATEGORY</th>
              <th>AUTHOR</th>
              <th>STATUS</th>
              <th>FEATURED</th>
              <th>VIEWS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <input type="checkbox" />
                </td>

                <td>
                  <div className="blog-info">
                    <div className="blog-thumbnail">
                      {blog.featured_image ? (
                        <img src={blog.featured_image} alt={blog.title} />
                      ) : (
                        <div className="placeholder-image">
                          <FaImage />
                        </div>
                      )}
                    </div>
                    <div className="blog-details">
                      <div className="blog-title">{blog.title}</div>
                      <div className="blog-excerpt">{blog.excerpt}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="category-badge">{blog.category}</span>
                </td>

                <td>{blog.author}</td>

                <td>
                  <span className={`status-badge status-${blog.is_published ? 'published' : 'draft'}`}>
                    {blog.is_published ? <FaCheck /> : <FaEyeSlash />} 
                    {blog.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>

                <td>
                  <span 
                    className={`featured-badge ${blog.is_featured ? 'featured' : 'not-featured'} clickable`}
                    onClick={() => handleToggleFeatured(blog)}
                    title="Click to toggle featured status"
                  >
                    {blog.is_featured ? <FaStar /> : <FaEyeSlash />} 
                    {blog.is_featured ? 'Featured' : 'Not Featured'}
                  </span>
                </td>

                <td>
                  <span className="view-count">
                    <FaChartLine /> {blog.view_count || 0}
                  </span>
                </td>

                <td>
                  <div className="date-info">
                    <FaCalendarAlt />
                    {new Date(blog.date_posted).toLocaleDateString()}
                  </div>
                </td>

                <td>
                  <div className="action-buttons">
                    <button className="btn btn-small btn-outline" onClick={() => handleViewClick(blog)}>
                      <FaEye />
                    </button>
                    <button className="btn btn-small btn-primary" onClick={() => handleEditClick(blog)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteBlog(blog.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* No Results Message */}
        {!loading && blogs.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">
              <FaSearch />
            </div>
            <h3>No blog posts found</h3>
            <p>
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedFeatured !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'No blog posts have been created yet.'}
            </p>
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedFeatured !== 'all' ? (
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSelectedFeatured('all');
                  setCurrentPage(1);
                }}
              >
                Clear All Filters
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <FaPlus /> Create Your First Blog Post
              </button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </div>
            <div className="pagination-controls">
              <button 
                className="btn btn-outline pagination-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`btn btn-outline page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                className="btn btn-outline pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simple Add Blog Dialog */}
      {isAddDialogOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3><FaPlus /> Create New Blog Post</h3>
              <button className="close-btn" onClick={() => setIsAddDialogOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  placeholder="Enter blog post title"
                />
              </div>

              <div className="form-group">
                <label>Excerpt *</label>
                <textarea
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                  placeholder="Enter a brief excerpt"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  placeholder="Write your blog post content here..."
                  rows="10"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={newBlog.author}
                    onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                    placeholder="Enter author name"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={newBlog.tags}
                  onChange={(e) => setNewBlog({...newBlog, tags: e.target.value})}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newBlog.is_published}
                      onChange={(e) => setNewBlog({...newBlog, is_published: e.target.checked})}
                    />
                    Publish immediately
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newBlog.is_featured}
                      onChange={(e) => setNewBlog({...newBlog, is_featured: e.target.checked})}
                    />
                    Feature this post
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleCreateBlog}
              >
                <FaSave /> Create Blog Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Dialog */}
      {isEditDialogOpen && editingBlog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3><FaEdit /> Edit Blog Post</h3>
              <button className="close-btn" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingBlog(null);
              }}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                  placeholder="Enter blog post title"
                />
              </div>

              <div className="form-group">
                <label>Excerpt *</label>
                <textarea
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                  placeholder="Enter a brief excerpt"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                  placeholder="Write your blog post content here..."
                  rows="10"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={editingBlog.author}
                    onChange={(e) => setEditingBlog({...editingBlog, author: e.target.value})}
                    placeholder="Enter author name"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={editingBlog.tags}
                  onChange={(e) => setEditingBlog({...editingBlog, tags: e.target.value})}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editingBlog.is_published}
                      onChange={(e) => setEditingBlog({...editingBlog, is_published: e.target.checked})}
                    />
                    Publish immediately
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editingBlog.is_featured}
                      onChange={(e) => setEditingBlog({...editingBlog, is_featured: e.target.checked})}
                    />
                    Feature this post
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingBlog(null);
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleUpdateBlog}
              >
                <FaSave /> Update Blog Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Blog Dialog */}
      {isViewDialogOpen && viewingBlog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3><FaEye /> View Blog Post</h3>
              <button className="close-btn" onClick={() => {
                setIsViewDialogOpen(false);
                setViewingBlog(null);
              }}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <div className="view-field">{viewingBlog.title}</div>
              </div>

              <div className="form-group">
                <label>Excerpt</label>
                <div className="view-field">{viewingBlog.excerpt}</div>
              </div>

              <div className="form-group">
                <label>Content</label>
                <div className="view-field content-view">{viewingBlog.content}</div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author</label>
                  <div className="view-field">{viewingBlog.author}</div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <div className="view-field">{viewingBlog.category}</div>
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="view-field">{viewingBlog.tags}</div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <div className="view-field">
                    <span className={`status-badge status-${viewingBlog.is_published ? 'published' : 'draft'}`}>
                      {viewingBlog.is_published ? <FaCheck /> : <FaEyeSlash />} 
                      {viewingBlog.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Featured</label>
                  <div className="view-field">
                    <span className={`featured-badge ${viewingBlog.is_featured ? 'featured' : 'not-featured'}`}>
                      {viewingBlog.is_featured ? <FaStar /> : <FaEyeSlash />} 
                      {viewingBlog.is_featured ? 'Featured' : 'Not Featured'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>View Count</label>
                  <div className="view-field">
                    <span className="view-count">
                      <FaChartLine /> {viewingBlog.view_count || 0}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Date Posted</label>
                  <div className="view-field">
                    <span className="date-info">
                      <FaCalendarAlt />
                      {new Date(viewingBlog.date_posted).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setViewingBlog(null);
                }}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setViewingBlog(null);
                  handleEditClick(viewingBlog);
                }}
              >
                <FaEdit /> Edit This Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
