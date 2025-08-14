import React, { useEffect, useState } from 'react';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/product') 
      .then(res => res.json())
      .then(data => {
        // Optionally only take the first 4-6 items as "featured"
        setProducts(data.slice(0, 6));
      })
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <section className='featured-products'>
      <div className='featured-container'>
        {products.map((product, index) => {
          const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
          return (
            <div key={index} className='product-card'>
              <img 
                src={primaryImage?.image_url?.startsWith('http') ? primaryImage.image_url : `http://localhost:5000/${primaryImage?.image_url}`} 
                alt={product.product_name}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              <h3>{product.product_name}</h3>
              <p className='view-more'>View More</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;

