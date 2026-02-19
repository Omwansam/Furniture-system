import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaUser, FaCalendarAlt, FaFolderOpen, FaClock, FaEye, FaArrowRight, FaTimes } from "react-icons/fa";
import { blogService } from "./blogService";
import "./BlogPage.css";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || "";
  const currentSearch = searchParams.get('search') || "";

  useEffect(() => {
    fetchBlogData();
  }, [currentPage, currentCategory, currentSearch]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      
      // Fetch posts with current filters
      const postsData = await blogService.getPosts(
        currentPage, 
        6, 
        currentCategory || null, 
        currentSearch || null
      );
      setPosts(postsData.posts);
      setPagination(postsData.pagination);

      // Fetch categories
      const categoriesData = await blogService.getCategories();
      setCategories(categoriesData);

      // Fetch recent posts
      const recentData = await blogService.getRecentPosts(4);
      setRecentPosts(recentData);

    } catch (err) {
      console.error('Error fetching blog data:', err);
      // Set fallback data
      setPosts(getFallbackPosts());
      setCategories(getFallbackCategories());
      setRecentPosts(getFallbackPosts().slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPosts = () => [
    {
      id: 1,
      title: "Going all-in with millennial design",
      slug: "going-all-in-with-millennial-design",
      excerpt: "Discover how millennial design trends are reshaping modern furniture and interior spaces with innovative approaches and sustainable materials.",
      author: "Admin",
      category: "Design",
      featured_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
      date_posted: "2024-01-15T10:00:00Z",
      view_count: 1250,
      read_time: 5,
      is_featured: true
    },
    {
      id: 2,
      title: "Exploring new ways of decorating",
      slug: "exploring-new-ways-of-decorating",
      excerpt: "Innovative decorating techniques that transform ordinary spaces into extraordinary living environments with creative solutions.",
      author: "Admin",
      category: "Interior",
      featured_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      date_posted: "2024-01-12T14:30:00Z",
      view_count: 890,
      read_time: 4,
      is_featured: false
    },
    {
      id: 3,
      title: "Handmade pieces that took time to make",
      slug: "handmade-pieces-that-took-time-to-make",
      excerpt: "The art of craftsmanship in furniture making, where every piece tells a story of dedication, skill, and timeless beauty.",
      author: "Admin",
      category: "Handmade",
      featured_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=400&fit=crop",
      date_posted: "2024-01-10T09:15:00Z",
      view_count: 2100,
      read_time: 7,
      is_featured: true
    },
    {
      id: 4,
      title: "Kitchen trends in 2024",
      slug: "kitchen-trends-in-2024",
      excerpt: "Stay ahead of the curve with the latest kitchen design trends that combine functionality, style, and modern technology.",
      author: "Admin",
      category: "Kitchen",
      featured_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
      date_posted: "2024-01-08T16:45:00Z",
      view_count: 1560,
      read_time: 6,
      is_featured: false
    },
    {
      id: 5,
      title: "Cozy home office setup ideas",
      slug: "cozy-home-office-setup-ideas",
      excerpt: "Create the perfect work-from-home environment with these cozy and productive home office design ideas.",
      author: "Admin",
      category: "Office",
      featured_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      date_posted: "2024-01-05T11:20:00Z",
      view_count: 980,
      read_time: 5,
      is_featured: false
    },
    {
      id: 6,
      title: "Sustainable furniture choices",
      slug: "sustainable-furniture-choices",
      excerpt: "Make environmentally conscious decisions with our guide to sustainable furniture materials and production methods.",
      author: "Admin",
      category: "Sustainability",
      featured_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=400&fit=crop",
      date_posted: "2024-01-03T13:10:00Z",
      view_count: 1340,
      read_time: 8,
      is_featured: true
    }
  ];

  const getFallbackCategories = () => [
    { name: "Design", count: 3 },
    { name: "Interior", count: 2 },
    { name: "Handmade", count: 1 },
    { name: "Kitchen", count: 1 },
    { name: "Office", count: 1 },
    { name: "Sustainability", count: 1 }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams();
    if (searchTerm.trim()) newSearchParams.set('search', searchTerm.trim());
    if (selectedCategory) newSearchParams.set('category', selectedCategory);
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const handleCategoryFilter = (category) => {
    const newSearchParams = new URLSearchParams();
    if (category) newSearchParams.set('category', category);
    if (currentSearch) newSearchParams.set('search', currentSearch);
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSearchParams({ page: '1' });
  };

  const goToPage = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  if (loading) {
    return (
      <div className="blog-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      {/* Header Section */}
      <div className="blog-header">
        <div className="header-content">
          <h1 className="blog-title">Our Blog</h1>
          <p className="blog-subtitle">Discover the latest trends, tips, and insights in furniture design and home decoration</p>
        </div>
      </div>

      <div className="blog-content-wrapper">
        {/* Main Blog Section */}
        <div className="blogs">
          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">Search</button>
              </div>
            </form>
            
            {(currentCategory || currentSearch) && (
              <button onClick={clearFilters} className="clear-filters-btn">
                <FaTimes />
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(currentCategory || currentSearch) && (
            <div className="active-filters">
              {currentCategory && (
                <span className="filter-tag">
                  Category: {currentCategory}
                  <button onClick={() => handleCategoryFilter("")}>×</button>
                </span>
              )}
              {currentSearch && (
                <span className="filter-tag">
                  Search: "{currentSearch}"
                  <button onClick={() => setSearchTerm("")}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="blog-grid">
            {posts.map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-image-container">
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="blog-image"
                    loading="lazy"
                  />
                  {post.is_featured && (
                    <div className="featured-badge">Featured</div>
                  )}
                  <div className="blog-image-overlay">
                    <Link to={`/blog/${post.slug}`} className="read-more-overlay">
                      Read Article
                    </Link>
                  </div>
                </div>
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="meta-item">
                      <FaUser />
                      {post.author}
                    </span>
                    <span className="meta-item">
                      <FaCalendarAlt />
                      {formatDate(post.date_posted)}
                    </span>
                    <span className="meta-item">
                      <FaFolderOpen />
                      {post.category}
                    </span>
                    <span className="meta-item">
                      <FaClock />
                      {post.read_time} min read
                    </span>
                    <span className="meta-item">
                      <FaEye />
                      {post.view_count} views
                    </span>
                  </div>
                  
                  <h3 className="blog-title">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="blog-excerpt">{post.excerpt}</p>
                  
                  <Link to={`/blog/${post.slug}`} className="read-more-link">
                    Read More <FaArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-btn prev-btn"
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === pagination.pages}
                className="pagination-btn next-btn"
              >
                Next
              </button>
            </div>
          )}

          {/* No Results */}
          {posts.length === 0 && !loading && (
            <div className="no-results">
              <h3>No blog posts found</h3>
              <p>Try adjusting your search terms or browse our categories</p>
              <button onClick={clearFilters} className="browse-all-btn">
                Browse All Posts
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Categories */}
          <div className="sidebar-section categories">
            <h4 className="sidebar-title">Categories</h4>
            <ul className="category-list">
              <li 
                className={`category-item ${!currentCategory ? 'active' : ''}`}
                onClick={() => handleCategoryFilter("")}
              >
                All Posts <span>{categories.reduce((sum, cat) => sum + cat.count, 0)}</span>
              </li>
              {categories.map((category, index) => (
                <li 
                  key={index}
                  className={`category-item ${currentCategory === category.name ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category.name)}
                >
                  {category.name} <span>{category.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="sidebar-section recent-posts">
            <h4 className="sidebar-title">Recent Posts</h4>
            <div className="recent-posts-list">
              {recentPosts.map((post) => (
                <div className="recent-post" key={post.id}>
                  <div className="recent-post-image">
                    <img src={post.featured_image} alt={post.title} />
                  </div>
                  <div className="recent-post-content">
                    <h5>
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h5>
                    <span className="recent-post-date">{formatDate(post.date_posted)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="sidebar-section newsletter">
            <h4 className="sidebar-title">Stay Updated</h4>
            <p>Get the latest blog posts and design tips delivered to your inbox.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;


