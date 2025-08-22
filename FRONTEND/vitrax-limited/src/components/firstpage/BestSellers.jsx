import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getBestSellers } from '../productService';
import './BestSeller.css';

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBestSellers();
        setBestSellers(data);
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setError('Failed to load best sellers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: '#FFD700' }}>★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" style={{ color: '#FFD700' }}>☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: '#D3D3D3' }}>☆</span>);
    }

    return stars;
  };

  const getImageUrl = (product) => {
    // Try to get primary image, fallback to first image, then placeholder
    if (product.primary_image) {
      return product.primary_image;
    }
    
    if (product.all_images && product.all_images.length > 0) {
      return product.all_images[0].image_url;
    }
    
    // Fallback to a placeholder image
    return 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Product+Image';
  };

  if (loading) {
    return (
      <section className='best-sellers'>
        <div className='sellers-container'>
          <div className='sellers-details'>
            <h2>Top Picks For You</h2>
            <p className='subtitle'>
              Find a bright ideal to suit your great selection of 
              suspension, floor and table lights.
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            fontSize: '18px',
            color: '#666'
          }}>
            Loading best sellers...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='best-sellers'>
        <div className='sellers-container'>
          <div className='sellers-details'>
            <h2>Top Picks For You</h2>
            <p className='subtitle'>
              Find a bright ideal to suit your great selection of 
              suspension, floor and table lights.
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            fontSize: '18px',
            color: '#ef4444',
            textAlign: 'center',
            padding: '20px'
          }}>
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='best-sellers'>
        <div className='sellers-container'>
            <div className='sellers-details'>
                <h2>Top Picks For You</h2>
                <p className='subtitle'>
            Find a bright ideal to suit your great selection of 
                    suspension, floor and table lights.
                </p>
            </div>

            <div className='sellers-grid'>
          {bestSellers.map((product) => (
            <div key={product.product_id} className='product-item'>
              <Link to={`/singleproduct/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img 
                  src={getImageUrl(product)}
                  alt={product.product_name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Product+Image';
                  }}
                />
                <h3>{product.product_name}</h3>
                <p className='product-price'>{formatPrice(product.product_price)}</p>
                
                {/* Rating and Order Count */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '10px',
                  fontSize: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {renderStars(product.avg_rating)}
                    <span style={{ color: '#666', marginLeft: '5px' }}>
                      ({product.avg_rating.toFixed(1)})
                    </span>
                  </div>
                  <span style={{ color: '#666' }}>
                    {product.order_count} sold
                  </span>
                </div>
              </Link>
                    </div>
                ))}
            </div>

        <Link to='/shop' className='sellers-btn'>
          <p>View More</p>
            </Link>
        </div>
    </section>
  );
};

export default BestSellers;
