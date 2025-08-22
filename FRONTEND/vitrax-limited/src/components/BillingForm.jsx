
import React, { useState, useEffect } from "react";
import { FaUser, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard } from "react-icons/fa";
import { cartService } from "./cartService";
import "./BillingForm.css";

const BillingForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    country: "Kenya",
    street_address: "",
    city: "",
    province: "Nairobi",
    zip_code: "",
    phone: "",
    email: "",
    additional_info: ""
  });

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");

  const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"];
  const provinces = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCartData(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createOrder = async (billingData) => {
    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          total_amount: cartData.total_price,
          shipping_address: `${billingData.street_address}, ${billingData.city}, ${billingData.province}, ${billingData.country}`,
          billing_details: billingData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      return orderData.order_id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const initiatePayment = async (orderId, amount) => {
    try {
      const response = await fetch("http://localhost:5000/payments/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          order_id: orderId,
          amount: amount
        })
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const paymentData = await response.json();
      return paymentData;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate phone number for M-Pesa
      if (paymentMethod === "mpesa" && !phoneNumber) {
        alert("Please enter your phone number for M-Pesa payment");
        setLoading(false);
        return;
      }

      // Create order
      const orderId = await createOrder(formData);
      
      // Initiate payment
      if (paymentMethod === "mpesa") {
        const paymentResult = await initiatePayment(orderId, parseFloat(cartData.total_price));
        
        if (paymentResult.success) {
          alert("Payment initiated successfully! Please check your phone for the M-Pesa prompt.");
          // Clear cart after successful order creation
          await cartService.clearCart();
          // Redirect to order confirmation
          window.location.href = `/order-confirmation/${orderId}`;
        } else {
          alert("Payment initiation failed. Please try again.");
        }
      } else {
        // For other payment methods, just create order
        alert("Order created successfully! You will be contacted for payment details.");
        await cartService.clearCart();
        window.location.href = `/order-confirmation/${orderId}`;
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="billing-container">
        <h2>Checkout</h2>
        <p>Your cart is empty. Please add items to your cart before checkout.</p>
      </div>
    );
  }

  return (
    <div className="billing-container">
      <h2>Checkout</h2>
      
      {/* Order Summary */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="order-items">
          {cartData.items.map((item) => (
            <div key={item.cart_item_id} className="order-item">
              <img 
                src={
                  item.image_url?.startsWith('http') 
                    ? item.image_url 
                    : `http://localhost:5000/${item.image_url}`
                }
                alt={item.product_name}
                className="order-item-img"
              />
              <div className="order-item-details">
                <h4>{item.product_name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>KSh {(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="order-total">
          <strong>Total: KSh {parseFloat(cartData.total_price).toLocaleString()}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Billing Details</h3>

        <div className="form-grid">
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <FaBuilding className="icon" />
          <input
            type="text"
            name="company_name"
            placeholder="Company Name (Optional)"
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <FaMapMarkerAlt className="icon" />
          <input
            type="text"
            name="street_address"
            placeholder="Street Address"
            value={formData.street_address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-grid">
          <div className="input-group">
            <FaMapMarkerAlt className="icon" />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
            >
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="input-group">
            <input
              type="text"
              name="zip_code"
              placeholder="ZIP Code"
              value={formData.zip_code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="input-group">
            <FaPhone className="icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <textarea
            name="additional_info"
            placeholder="Additional Information (Optional)"
            value={formData.additional_info}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* Payment Method Selection */}
        <div className="payment-method">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="payment_method"
                value="mpesa"
                checked={paymentMethod === "mpesa"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaCreditCard className="payment-icon" />
              <span>M-Pesa</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="payment_method"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaCreditCard className="payment-icon" />
              <span>Bank Transfer</span>
            </label>
          </div>

          {paymentMethod === "mpesa" && (
            <div className="input-group">
              <FaPhone className="icon" />
              <input
                type="tel"
                placeholder="M-Pesa Phone Number (e.g., 254712345678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : `Pay KSh ${parseFloat(cartData.total_price).toLocaleString()}`}
        </button>
      </form>
    </div>
  );
};

export default BillingForm;
