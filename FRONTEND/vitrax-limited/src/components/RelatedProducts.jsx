import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import './RelatedProducts.css'

const API_BASE_URL = "http://localhost:5000/api";

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async (retryCount = 0) => {
      if (!currentProduct?.product_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null); // Clear previous errors
        
        // Use simple route that should work better
        const url = `${API_BASE_URL}/related-products/${currentProduct.product_id}`;
        
        console.log(`Fetching related products from: ${url} (attempt ${retryCount + 1})`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            "Accept": "application/json"
          },
          mode: 'cors',
          credentials: 'omit'
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Related products data:", data);
        setRelatedProducts(data.related_products || []);
      } catch (err) {
        console.error("Error fetching related products:", err);
        
        // Retry logic for network errors
        if (retryCount < 2 && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
          console.log(`Retrying in 1 second... (${retryCount + 1}/2)`);
          setTimeout(() => {
            fetchRelatedProducts(retryCount + 1);
          }, 1000);
          return;
        }
        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure backend is ready
    const timeoutId = setTimeout(() => {
      fetchRelatedProducts();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentProduct?.product_id]);

  const handleProductClick = (productId) => {
    navigate(`/singleproduct/${productId}`);
  };

  if (loading) {
    return (
      <section className='best-sellers'>
        <div className='sellers-container'>
          <div className='sellers-details'>
            <h2>Related Products</h2>
          </div>
          <div className='loading-container'>
            <p>Loading related products...</p>
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
            <h2>Related Products</h2>
          </div>
          <div className='error-container'>
            <p>Unable to load related products</p>
          </div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <section className='best-sellers'>
        <div className='sellers-container'>
          <div className='sellers-details'>
            <h2>Related Products</h2>
          </div>
          <div className='no-products-container'>
            <p>No related products found</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='best-sellers'>
        <div className='sellers-container'>
            <div className='sellers-details'>
                <h2>Related Products</h2>
                <p>You might also like these products</p>
            </div>

            <div className='sellers-grid'>
                {relatedProducts.map((product) => (
                    <div 
                        key={product.product_id} 
                        className='product-item'
                        onClick={() => handleProductClick(product.product_id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className='product-image-container'>
                            <img 
                                src={product.primary_image || "/placeholder-image.jpg"} 
                                alt={product.product_name}
                                onError={(e) => {
                                    e.target.src = "/placeholder-image.jpg";
                                }}
                            />
                            {product.stock_quantity === 0 && (
                                <div className="out-of-stock-badge">Out of Stock</div>
                            )}
                        </div>
                        <div className='product-info'>
                            <h3>{product.product_name}</h3>
                            <p className='product-price'>KSh {product.product_price.toLocaleString()}</p>
                            {product.category_name && (
                                <p className='product-category'>{product.category_name}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Link to='/shop' className='sellers-btn'>
                <p>View More Products</p>
            </Link>
        </div>
    </section>
  )
}

export default RelatedProducts
