import React, { useState, useEffect } from "react";
import { cartService } from "./cartService";
import { getPrimaryImageUrl } from "../utils/imageUtils";
import "./OrderSummary.css";

const OrderSummary = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartData(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartData({ items: [], total_price: "0.00" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-container">
        <div className="loading-spinner">Loading order summary...</div>
      </div>
    );
  }

  const cartItems = cartData?.items || [];
  const subtotal = parseFloat(cartData?.total_price || "0.00");

  return (
    <div className="order-container">
      {/* Order Header */}
      <div className="order-header">
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      {/* Order Items */}
      {cartItems.map((item) => (
        <div key={item.cart_item_id} className="order-item">
          <div className="order-item-details">
            <img 
              src={getPrimaryImageUrl(item)}
              alt={item.product_name} 
              className="order-item-img"
              onError={(e) => {
                console.error('Image failed to load for order item:', item.cart_item_id, 'URL:', e.target.src);
                // Show placeholder on error
                e.target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'order-item-img-placeholder';
                placeholder.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21,15 16,10 5,21"></polyline></svg>';
                e.target.parentNode.insertBefore(placeholder, e.target);
              }}
            />
            <div className="order-item-info">
              <span className="order-item-name">{item.product_name}</span>
              <span className="order-item-quantity">× {item.quantity}</span>
            </div>
          </div>
          <span className="order-item-price">KSh {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
        </div>
      ))}

      {/* Subtotal */}
      <div className="order-total">
        <span>Subtotal</span>
        <span>KSh {subtotal.toLocaleString()}</span>
      </div>

      {/* Final Total */}
      <div className="order-final">
        <span>Total</span>
        <span className="highlight">KSh {subtotal.toLocaleString()}</span>
      </div>

      {/* Privacy Notice */}
      <p className="privacy-notice">
        Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <span className="privacy-policy">privacy policy</span>.
      </p>
    </div>
  );
};

export default OrderSummary;
