import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiFacebook, FiLinkedin, FiInstagram } from "react-icons/fi";
import ProductDetails from '../components/ProductDetails';
import RelatedProducts from '../components/RelatedProducts';
import CartPopup from "../components/CartPopup";
import "./SingleProduct.css";

const API_BASE_URL = "http://127.0.0.1:5000/api";

const SingleProduct = () => {
  const { productId } = useParams();
  const navigate= useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);


  // Added for popup
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
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

     try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowLoginPrompt(true); // Show popup
        setTimeout(() => {
          setShowLoginPrompt(false);
          navigate("/login"); 
        }, 2000); // auto-hide redirects after 2s
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/cart/items`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add item to cart");
      }

      setIsCartOpen(true);
    } catch (err) {
       setErrorMessage(err.message);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };

    // Check if product already exists in cart
    //const existingItemIndex = cartItems.findIndex(
    //  item => item.product.product_id === product.product_id
    //);

    //if (existingItemIndex >= 0) {
      // Update quantity if product exists
    //  const updatedItems = [...cartItems];
    //  updatedItems[existingItemIndex].quantity += quantity;
    //  setCartItems(updatedItems);
    //} else {
      // Add new item to cart
    //  setCartItems([...cartItems, { product, quantity }]);
    //}

  //  setIsCartOpen(true);
  //};

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleThumbnailClick = (imgUrl) => {
    setMainImage(imgUrl);
  };

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <div className="single-product-container">
        {/* Left Section - Images */}
        <div className="image-section">
          <div className="main-image">
            <img
              src={mainImage.startsWith('http') ? mainImage : `http://127.0.0.1:5000${mainImage}`}
              alt={product.product_name}
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
                  src={img.image_url.startsWith('http') ? img.image_url : `http://127.0.0.1:5000${img.image_url}`}
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
        <h1 className="product-title">{product.product_name}</h1>
        <p className="description">{product.product_description}</p>
        <p className="price">KSh {product.product_price.toLocaleString()}</p>
        <div className="rating">⭐⭐⭐⭐☆ <span className="review-count">5 Customer Reviews</span></div>
        

        {/* Size Options 
        <div className="size-options">
          <span>Size:</span>
          <button className="size-btn">L</button>
          <button className="size-btn">XL</button>
          <button className="size-btn">XS</button>
        </div> */}

        {/* Color Options */}
        <div className="color-options">
          <span>Color:</span>
          <button className="color-circle" style={{ backgroundColor: "blue" }}></button>
          <button className="color-circle" style={{ backgroundColor: "black" }}></button>
          <button className="color-circle" style={{ backgroundColor: "gold" }}></button>
        </div>

        {/* Quantity Selector & Add to Cart */}
        <div className="quantity-container">
          <button  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
          <span >{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add To Cart
          </button>

          {/* Cart Popup */}
      {isCartOpen && (
        <CartPopup 
          cartItems={cartItems} 
          onClose={handleCloseCart} 
        />
      )}
        
        {/**Delivery statement */}
        <div className="delivery-statement">
          <p >Home / Office Delivery is Only Available in Nairobi and Mombasa within city limits </p>
        </div>
        {/* Product Meta */}
        <div className="single-meta">
          <p><strong>SKU:</strong> {product.product_id || "N/A"}</p>
          <p><strong>Category:</strong> Sofas</p>
          <p><strong>Tags:</strong> Sofa, Chair, Home, Shop</p>
        </div>

        {/* Social Media Share Icons */}
        <div className="social-share">
          <FiFacebook className="social-icon" />
          <FiLinkedin className="social-icon" />
          <FiInstagram className="social-icon" />
        </div>
      </div>
      </div>
      <ProductDetails />
      <RelatedProducts />

      {/* Login Popup Message */}
      {showLoginPrompt && (
        <div className="toast-popup">
          Please log in to add items to cart.
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
