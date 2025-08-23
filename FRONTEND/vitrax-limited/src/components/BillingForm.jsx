
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
      const response = await fetch("http://localhost:5000/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          shipping_address: `${billingData.street_address}, ${billingData.city}, ${billingData.province}, ${billingData.country}`,
          payment_method: paymentMethod,
          billing_details: billingData,
          coupon_code: null // Optional coupon code
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
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
      console.log("Sending M-Pesa STK push request:", {
        phone_number: phoneNumber,
        order_id: orderId,
        amount: amount
      });

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

      console.log("M-Pesa response status:", response.status);
      
      if (!response.ok) {
        let errorMessage = 'Payment initiation failed';
        try {
          const errorData = await response.json();
          console.error("M-Pesa error response:", errorData);
          errorMessage = errorData.error || errorData.message || 'Payment initiation failed';
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const paymentData = await response.json();
      console.log("M-Pesa success response:", paymentData);
      return paymentData;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  };

  const initiateStripePayment = async (orderId, amount) => {
    try {
      // Create payment intent
      const response = await fetch("http://localhost:5000/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: amount,
          order_id: orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { payment_intent_id } = await response.json();

      // For now, we'll just confirm the payment intent without card details
      // In a real implementation, you would use Stripe Elements for card input
      const confirmResponse = await fetch("http://localhost:5000/stripe/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          payment_intent_id: payment_intent_id
        })
      });

      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json();
        throw new Error(errorData.error || 'Payment confirmation failed');
      }

      const confirmData = await confirmResponse.json();
      return { success: true, paymentIntent: confirmData };
    } catch (error) {
      console.error('Error with Stripe payment:', error);
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

      console.log("Creating order with data:", {
        shipping_address: `${formData.street_address}, ${formData.city}, ${formData.province}, ${formData.country}`,
        payment_method: paymentMethod,
        billing_details: formData
      });

      // Create order
      const orderId = await createOrder(formData);
      console.log("Order created successfully with ID:", orderId);
      
      // Initiate payment based on method
      if (paymentMethod === "mpesa") {
        try {
          console.log("Initiating M-Pesa payment for order:", orderId);
          console.log("Payment amount:", parseFloat(cartData.total_price));
          console.log("Phone number:", phoneNumber);
          
          const paymentResult = await initiatePayment(orderId, parseFloat(cartData.total_price));
          console.log("M-Pesa payment result:", paymentResult);
          
          if (paymentResult.CheckoutRequestID) {
            alert("Payment initiated successfully! Please check your phone for the M-Pesa prompt.");
            // Clear cart after successful order creation
            await cartService.clearCart();
            // Redirect to order confirmation
            window.location.href = `/order-confirmation/${orderId}`;
          } else {
            alert("Payment initiation failed. Please try again.");
          }
        } catch (paymentError) {
          console.error("Payment error:", paymentError);
          alert(`Payment initiation failed: ${paymentError.message}`);
        }
      } else if (paymentMethod === "bank") {
        // For Stripe credit card payment
        try {
          const paymentResult = await initiateStripePayment(orderId, parseFloat(cartData.total_price));
          
          if (paymentResult.success) {
            alert("Payment processed successfully!");
            await cartService.clearCart();
            window.location.href = `/order-confirmation/${orderId}`;
          } else {
            alert("Payment failed. Please try again.");
          }
        } catch (paymentError) {
          console.error("Stripe payment error:", paymentError);
          alert(`Payment failed: ${paymentError.message}`);
        }
      } else {
        // For other methods, order is already created
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
              <span>Credit Card (Stripe)</span>
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
