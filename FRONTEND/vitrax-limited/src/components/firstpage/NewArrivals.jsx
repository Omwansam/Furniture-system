import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiStar, FiShoppingCart } from 'react-icons/fi';
import { getRecentProducts } from '../productService';
import './NewArrivals.css';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  const fetchRecentProducts = async () => {
    try {
      setLoading(true);
      const data = await getRecentProducts(5);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching recent products:', err);
      setError('Failed to load new arrivals');
      // Set fallback data
      setProducts(getFallbackProducts());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackProducts = () => [
    {
      product_id: 1,
      product_name: "Modern Living Room Sofa",
      product_description: "Elegant and comfortable sofa perfect for modern living spaces",
      product_price: 1299.99,
      primary_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop"
    },
    {
      product_id: 2,
      product_name: "Ergonomic Office Chair",
      product_description: "Professional office chair with superior comfort and support",
      product_price: 599.99,
      primary_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop"
    },
    {
      product_id: 3,
      product_name: "Dining Table Set",
      product_description: "Beautiful dining table with matching chairs for family gatherings",
      product_price: 899.99,
      primary_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=400&fit=crop"
    },
    {
      product_id: 4,
      product_name: "Bedroom Nightstand",
      product_description: "Elegant nightstand with storage for bedroom organization",
      product_price: 299.99,
      primary_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop"
    },
    {
      product_id: 5,
      product_name: "Kitchen Bar Stools",
      product_description: "Modern bar stools perfect for kitchen islands and breakfast bars",
      product_price: 199.99,
      primary_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop"
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentProduct = products[currentSlide];

  if (loading) {
    return (
      <section className='new-arrival'>
        <div className='arrivals-container'>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading new arrivals...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className='new-arrival'>
        <div className='arrivals-container'>
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchRecentProducts} className="retry-btn">Try Again</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='new-arrival'>
      <div className="arrivals-background-pattern"></div>
      
      <div className='arrivals-container'>
        {/* Header */}
        <div className="arrivals-header">
          <div className="header-content">
            <p className='arrivals-subtitle'>New Arrivals</p>
            <h2 className='arrivals-title'>Latest Products</h2>
            <p className="arrivals-description">Discover our newest furniture additions, carefully selected for your home</p>
          </div>
          
          {/* Navigation Controls */}
          <div className="carousel-controls">
            <button 
              className="nav-btn prev-btn" 
              onClick={prevSlide}
              aria-label="Previous product"
            >
              <FiChevronLeft />
            </button>
            <button 
              className="nav-btn next-btn" 
              onClick={nextSlide}
              aria-label="Next product"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Main Carousel */}
        <div className="carousel-main">
          <div className="product-display">
            {/* Product Image */}
            <div className="product-image-container">
              <img 
                src={currentProduct?.primary_image} 
                alt={currentProduct?.product_name}
                className="product-image"
                loading="lazy"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <span className="new-badge">NEW</span>
                  <Link to={`/product/${currentProduct?.product_id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="product-details">
              <h3 className="product-name">{currentProduct?.product_name}</h3>
              <p className="product-description">{currentProduct?.product_description}</p>
              
              <div className="product-meta">
                <div className="price-section">
                  <span className="product-price">{formatPrice(currentProduct?.product_price)}</span>
                  <span className="price-label">Starting from</span>
                </div>
                
                <div className="rating-section">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} className="star-icon" />
                    ))}
                  </div>
                  <span className="rating-text">4.8 (24 reviews)</span>
                </div>
              </div>

              <div className="product-actions">
                <Link to={`/product/${currentProduct?.product_id}`} className="order-btn">
                  <FiShoppingCart />
                  <span>Order Now</span>
                </Link>
                <Link to="/shop" className="browse-btn">
                  Browse All
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {products.map((_, index) => (
            <button
              key={index}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>

        {/* Product Counter */}
        <div className="product-counter">
          <span className="current-number">{currentSlide + 1}</span>
          <span className="total-number">/{products.length}</span>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;