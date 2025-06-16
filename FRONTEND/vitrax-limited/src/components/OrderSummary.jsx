import React from "react";
import "./OrderSummary.css";

const OrderSummary = () => {
  return (
    <div className="order-container">
      {/* Order Header */}
      <div className="order-header">
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      {/* Order Item */}
      <div className="order-item">
        <span>Augmented Sofa × 1</span>
        <span>Rs. 250,000.00</span>
      </div>

      {/* Subtotal */}
      <div className="order-total">
        <span>Subtotal</span>
        <span>Rs. 250,000.00</span>
      </div>

      {/* Final Total */}
      <div className="order-final">
        <span>Total</span>
        <span className="highlight">Rs. 250,000.00</span>
      </div>

      {/* Payment Options */}
      <div className="payment-options">
        <label className="payment-label">
          <input type="radio" name="payment" defaultChecked />
          Direct Bank Transfer
        </label>
        <p className="payment-info">
          Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
        </p>

        <label className="payment-label">
          <input type="radio" name="payment" />
          Cash on Delivery
        </label>
      </div>

      {/* Privacy Notice */}
      <p className="privacy-notice">
        Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <span className="privacy-policy">privacy policy</span>.
      </p>

      {/* Place Order Button */}
      <button className="place-order">Place order</button>
    </div>
  );
};

export default OrderSummary;
