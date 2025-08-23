import React, { useEffect, useState } from 'react';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/product') 
      .then(res => res.json())
      .then(data => {
        // Handle the correct response format - data.products is the array
        const productsArray = data.products || data;
        setProducts(productsArray);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setIsLoading(false);
      });
  }, []);

  // Calculate total slides needed
  const totalSlides = Math.ceil(products.length / 6);
  
  // Get current 6 products
  const currentProducts = products.slice(currentSlide * 6, (currentSlide * 6) + 6);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex) => {
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
          {currentProducts.map((product, index) => {
            const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
            return (
              <div 
                key={`${currentSlide}-${index}`} 
                className='product-card'
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className='product-image-container'>
                  <img 
                    src={primaryImage?.image_url?.startsWith('http') ? primaryImage.image_url : `http://localhost:5000/${primaryImage?.image_url}`} 
                    alt={product.product_name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
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
            );
          })}
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

