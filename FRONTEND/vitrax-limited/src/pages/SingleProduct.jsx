import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiFacebook, FiLinkedin, FiInstagram, FiShoppingCart, FiHeart, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";
import ProductDetails from '../components/ProductDetails';
import RelatedProducts from '../components/RelatedProducts';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./SingleProduct.css";

const API_BASE_URL = "http://localhost:5000/api";

const SingleProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Toast notifications
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${productId}`, {
          headers: { "Cache-Control": "no-cache" },
        });

        if (!response.ok) throw new Error("Failed to fetch product details");

        const data = await response.json();
        setProduct(data);

        // Process images - ensure we have at least one image
        if (data.images && data.images.length > 0) {
          // Find primary image or use first image as fallback
          const primaryImg = data.images.find(img => img.is_primary) || data.images[0];
          setMainImage(primaryImg.image_url);
          
          // Set other images as thumbnails (excluding the primary/main image)
          setThumbnails(data.images.filter(img => img.image_url !== primaryImg.image_url));
        } else {
          // No images case
          setMainImage("/placeholder-image.jpg");
          setThumbnails([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    // Check if user is authenticated
    if (!user) {
      setShowLoginPrompt(true);
        setTimeout(() => {
          setShowLoginPrompt(false);
        navigate("/login", { state: { from: `/singleproduct/${productId}` } });
      }, 2000);
        return;
      }

    setAddingToCart(true);
    try {
      const success = await addToCart(product, quantity);
      
      if (success) {
        // Show success message
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (err) {
       setErrorMessage(err.message);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleThumbnailClick = (imgUrl) => {
    setMainImage(imgUrl);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner">
        <FiRefreshCw className="spinning" />
        <p>Loading product details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <h2>Error Loading Product</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );
  
  if (!product) return (
    <div className="error-container">
      <h2>Product Not Found</h2>
      <p>The product you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/shop')}>Back to Shop</button>
    </div>
  );

  return (
    <div className="single-product-page">
      <div className="single-product-container">
        {/* Left Section - Images */}
        <div className="image-section">
          <div className="main-image-container">
            <img
              src={mainImage.startsWith('http') ? mainImage : `http://localhost:5000${mainImage}`}
              alt={product.product_name}
              className="main-image"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
          </div>
          {thumbnails.length > 0 && (
            <div className="thumbnail-gallery">
              {thumbnails.map((img, index) => (
                <img
                  key={index}
                  src={img.image_url.startsWith('http') ? img.image_url : `http://localhost:5000${img.image_url}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={img.image_url === mainImage ? "active-thumbnail" : ""}
                  onClick={() => handleThumbnailClick(img.image_url)}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Product Details */}
      <div className="product-details-section">
          <div className="product-header">
        <h1 className="product-title">{product.product_name}</h1>
            <div className="product-rating">
              <div className="stars">⭐⭐⭐⭐☆</div>
              <span className="review-count">5 Customer Reviews</span>
            </div>
          </div>

          <div className="product-price-section">
        <p className="price">KSh {product.product_price.toLocaleString()}</p>
            <div className="price-badges">
              <span className="badge free-shipping">
                <FiTruck /> Free Shipping
              </span>
              <span className="badge warranty">
                <FiShield /> 1 Year Warranty
              </span>
            </div>
          </div>

          <div className="product-description">
            <p>{product.product_description}</p>
          </div>

        {/* Color Options */}
          <div className="product-options">
        <div className="color-options">
              <label>Color:</label>
              <div className="color-buttons">
                <button className="color-circle active" style={{ backgroundColor: "brown" }} title="Brown"></button>
                <button className="color-circle" style={{ backgroundColor: "black" }} title="Black"></button>
                <button className="color-circle" style={{ backgroundColor: "beige" }} title="Beige"></button>
                <button className="color-circle" style={{ backgroundColor: "gray" }} title="Gray"></button>
              </div>
            </div>
        </div>

        {/* Quantity Selector & Add to Cart */}
          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
        <div className="quantity-container">
                <button 
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
            </div>

            <div className="action-buttons">
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <>
                    <FiRefreshCw className="spinning" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FiShoppingCart />
            Add To Cart
                  </>
                )}
          </button>

              <button className="wishlist-btn">
                <FiHeart />
              </button>
            </div>
          </div>

          {/* Product Features */}
          <div className="product-features">
            <div className="feature">
              <FiTruck />
              <div>
                <h4>Free Delivery</h4>
                <p>Nairobi & Mombasa within city limits</p>
              </div>
            </div>
            <div className="feature">
              <FiShield />
              <div>
                <h4>1 Year Warranty</h4>
                <p>Full coverage on all products</p>
              </div>
            </div>
            <div className="feature">
              <FiRefreshCw />
              <div>
                <h4>Easy Returns</h4>
                <p>30-day return policy</p>
              </div>
            </div>
        </div>

        {/* Product Meta */}
          <div className="product-meta">
            <div className="meta-item">
              <strong>SKU:</strong> {product.product_id || "N/A"}
            </div>
            <div className="meta-item">
              <strong>Category:</strong> Furniture
            </div>
            <div className="meta-item">
              <strong>Tags:</strong> Sofa, Chair, Home, Shop
            </div>
        </div>

          {/* Social Media Share */}
        <div className="social-share">
            <span>Share:</span>
          <FiFacebook className="social-icon" />
          <FiLinkedin className="social-icon" />
          <FiInstagram className="social-icon" />
        </div>
      </div>
      </div>

      {/* Product Details & Related Products */}
      <ProductDetails />
      <RelatedProducts />

      {/* Toast Notifications */}
      {showLoginPrompt && (
        <div className="toast-popup">
          Please log in to add items to cart.
        </div>
      )}
      {showSuccessPopup && (
        <div className="toast-popup success-popup">
          Item added to cart successfully!
        </div>
      )}
      {showErrorPopup && (
        <div className="toast-popup error-popup">{errorMessage}</div>
      )}
    </div>
  );
};

export default SingleProduct;








{/**import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { FiFacebook, FiLinkedin, FiInstagram } from "react-icons/fi";

import './SingleProduct.css'
import ProductDetails from '../components/ProductDetails';
import RelatedProducts from '../components/RelatedProducts';
import CartPopup from '../components/CartPopup';
import { getProductById } from '../components/productService'



const SingleProduct = () => {
  
  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);


  // const product = products.find((p) => p.id === Number(id));

  useEffect(() => {
    const fetchProduct = async () => {
        try {
            const productData = await getProductById(id);
            setProduct(productData);
            if (productData.images.length > 0) {
                setMainImage(productData.images[0].image_url);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchProduct();
}, [id]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;


  // Product Data Handling
  

  

  return (
    <div>
      <div className="single-container">
        <div className="single-images">
          <div className="thumbnail-list">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.image_url}
                alt="Thumbnail"
                className={`thumbnail ${mainImage === img.image_url ? "active-thumb" : ""}`}
                onClick={() => setMainImage(img.image_url)}
              />
            ))}
          </div>
          <img src={mainImage} alt="Main Product" className="main-image" />
        </div>

        <div className="single-info">
          <h1>{product.product_name}</h1>
          <p className="price">Rs. {product.product_price.toLocaleString()}</p>
          <div className="rating">
            ⭐⭐⭐⭐☆ <span>5 Customer Reviews</span>
          </div>
          <p className="description">{product.product_description}</p>

          
          

          <div className="quantity-container">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button className="add-to-cart" onClick={() => setIsCartOpen(true)}>
            Add To Cart
          </button>

          {isCartOpen && <CartPopup product={product} quantity={quantity} onClose={() => setIsCartOpen(false)} />}

          <div className="single-meta">
            <p><strong>SKU:</strong> {product.sku || "SS001"}</p>
            <p><strong>Category:</strong> {product.category_id || "Sofas"}</p>
            <p><strong>Tags:</strong> {product.tags?.join(", ") || "Sofa, Chair, Home, Shop"}</p>
          </div>

          <div className="single-icons">
            <FiFacebook className="social-icon" />
            <FiLinkedin className="social-icon" />
            <FiInstagram className="social-icon" />
          </div>
        </div>
      </div>
      <ProductDetails />
      <RelatedProducts />
    </div>
  );
};

export default SingleProduct**/}
