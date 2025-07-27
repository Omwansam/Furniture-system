import React from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import "./CartPopup.css";

const CartPopup = ({ cartItems = [], onClose }) => {
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-popup-overlay">
        <div className="cart-popup">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.product_price || 0) * (item.quantity || 0);
  }, 0);

  return (
    <div className="cart-popup-overlay">
      <div className="cart-popup">
        <h2>Shopping Cart</h2>
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        <div className="cart-items-container">
          {cartItems.map((item, index) => {
            const product = item.product;
            
            // Safely get the primary image or first image
            const primaryImage = product?.images?.find(img => img.is_primary) || 
                               product?.images?.[0] || 
                               { image_url: "/placeholder-image.jpg" };

            return (
              <div key={`${product?.product_id || index}`} className="cart-item">
                <img
                  src={
                    primaryImage.image_url.startsWith('http') 
                      ? primaryImage.image_url 
                      : `http://127.0.0.1:5000${primaryImage.image_url}`
                  }
                  alt={product?.product_name || 'Product image'}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="cart-item-details">
                  <h3>{product?.product_name || 'Unknown Product'}</h3>
                  <p>Quantity: {item.quantity || 0}</p>
                  <p className="cart-price">
                    Rs. {(product?.product_price || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-subtotal">
          <p>
            <strong>Subtotal:</strong> KSh {subtotal.toLocaleString()}
          </p>
        </div>

        <div className="cart-pop-buttons">
          <button className="view-cart-btn" onClick={() => navigate("/cart")}>
            View Cart
          </button>
          <button
            className="checkout-pop-btn"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;




{/**import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FiX } from "react-icons/fi";
import "./CartPopup.css";

const CartPopup = ({ product, quantity, onClose }) => {
  const navigate = useNavigate(); // Hook for navigation

  if (!product) return null;

  return (
    <div className="cart-popup-overlay">
      <div className="cart-popup">
        <h2>Shopping Cart</h2>
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        <div className="cart-item">
        <img
            src={`http://127.0.0.1:5000${product.images[0].image_url}`}
            alt={product.product_name}
            className="cart-item-img"
          />
          <div className="cart-item-details">
            <h3>{product.name}</h3>
            <p>Quantity: {quantity}</p>
            <p className="cart-price">Rs. {product.product_price.toLocaleString()}</p>
          </div>
        </div>

        <div className="cart-subtotal">
          <p><strong>Subtotal:</strong> Rs. {(product.product_price * quantity).toLocaleString()}</p>
        </div>

        <div className="cart-pop-buttons">
          <button className="view-cart-btn" onClick={() => navigate("/cart")}>View Cart</button>
          <button className="checkout-pop-btn" onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup; **/}

