import React, { useState, useEffect } from "react";
import { cartService } from "./cartService";
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
          <span>{item.product_name} × {item.quantity}</span>
          <span>KSh {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
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
