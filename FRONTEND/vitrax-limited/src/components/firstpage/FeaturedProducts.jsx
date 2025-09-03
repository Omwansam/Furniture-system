import React, { useEffect, useState } from 'react';
import { getPrimaryImageUrl, handleImageError } from '../../utils/imageUtils';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/product') 
      .then(res => res.json())
      .then(data => {
        // Normalize API response to always be an array
        let productsArray = [];
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data && Array.isArray(data.products)) {
          productsArray = data.products;
        } else {
          console.warn('Unexpected products response shape:', data);
          productsArray = [];
        }
        setProducts(productsArray);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts([]);
        setIsLoading(false);
      });
  }, []);

  // Calculate total slides needed; ensure at least 1 to avoid modulo by 0
  const totalSlides = Math.max(1, Math.ceil((Array.isArray(products) ? products.length : 0) / 6));
  
  // Get current 6 products safely
  const currentProducts = Array.isArray(products)
    ? products.slice(currentSlide * 6, (currentSlide * 6) + 6)
    : [];

  const nextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex) => {
    if (slideIndex < 0 || slideIndex >= totalSlides) return;
    setCurrentSlide(slideIndex);
  };

  if (isLoading) {
    return (
      <section className='featured-products'>
        <div className='featured-container'>
          <div className='loading-spinner'>Loading featured products...</div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <section className='featured-products'>
        <div className='featured-header'>
          <h2>Featured Products</h2>
          <p>Discover our most popular furniture pieces</p>
        </div>
        <div className='featured-container'>
          <div className='empty-state'>No products available right now.</div>
        </div>
      </section>
    );
  }

  return (
    <section className='featured-products'>
      <div className='featured-header'>
        <h2>Featured Products</h2>
        <p>Discover our most popular furniture pieces</p>
      </div>
      
      <div className='carousel-container'>
        {/* Navigation Buttons */}
        {totalSlides > 1 && (
          <>
            <button 
              className='carousel-btn prev-btn' 
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button 
              className='carousel-btn next-btn' 
              onClick={nextSlide}
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}

        {/* Products Grid */}
        <div className='featured-container'>
          {currentProducts.map((product, index) => (
            <div 
              key={`${currentSlide}-${index}`} 
              className='product-card'
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className='product-image-container'>
                <img 
                  src={getPrimaryImageUrl(product)} 
                  alt={product.product_name}
                  onError={(e) => handleImageError(e)}
                />
                  <div className='product-overlay'>
                    <button className='view-details-btn'>View Details</button>
                  </div>
                </div>
                <div className='product-info'>
                  <h3>{product.product_name}</h3>
                  <p className='product-price'>${product.product_price?.toLocaleString() || '0'}</p>
                  <p className='view-more'>View More</p>
                </div>
              </div>
          ))}
        </div>

        {/* Slide Indicators */}
        {totalSlides > 1 && (
          <div className='slide-indicators'>
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

