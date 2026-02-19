
import React, { useState, useEffect } from "react";
import { FaUser, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard, FaSave, FaHistory } from "react-icons/fa";
import { cartService } from "./cartService";
import { getPrimaryImageUrl } from "../utils/imageUtils";
import "./BillingForm.css";
import PaymentStatus from "./mpesa/PaymentStatus";



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
  const [useBillingPhone, setUseBillingPhone] = useState(true);
  const [savedShippingInfo, setSavedShippingInfo] = useState([]);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [saveForLater, setSaveForLater] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);

  const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"];
  const provinces = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];

  useEffect(() => {
    fetchCart();
    fetchSavedShippingInfo();
  }, []);

  // Keep M-Pesa phone in sync with billing phone if toggled
  useEffect(() => {
    if (paymentMethod === 'mpesa' && useBillingPhone) {
      setPhoneNumber(formData.phone || "");
    }
  }, [paymentMethod, useBillingPhone, formData.phone]);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCartData(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchSavedShippingInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/shipping/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedShippingInfo(data.shipping_infos || []);
        
        // Auto-populate form with default shipping info if available
        const defaultInfo = data.shipping_infos?.find(info => info.is_default) || data.shipping_infos?.[0];
        if (defaultInfo) {
          setFormData({
            first_name: defaultInfo.first_name || "",
            last_name: defaultInfo.last_name || "",
            company_name: defaultInfo.company_name || "",
            country: defaultInfo.country || "Kenya",
            street_address: defaultInfo.street_address || "",
            city: defaultInfo.city || "",
            province: defaultInfo.province || "Nairobi",
            zip_code: defaultInfo.zip_code || "",
            phone: defaultInfo.phone || "",
            email: defaultInfo.email || "",
            additional_info: defaultInfo.additional_info || ""
          });
        }
      }
    } catch (error) {
      console.error('Error fetching saved shipping info:', error);
    }
  };

  const saveShippingInfo = async (shippingData, isDefault = false) => {
    try {
      const response = await fetch("http://localhost:5000/shipping/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...shippingData,
          is_default: isDefault
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Shipping info saved:', data);
        // Refresh the saved shipping info list
        await fetchSavedShippingInfo();
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error saving shipping info:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error saving shipping info:', error);
      return false;
    }
  };

  const loadSavedAddress = (address) => {
    setFormData({
      first_name: address.first_name || "",
      last_name: address.last_name || "",
      company_name: address.company_name || "",
      country: address.country || "Kenya",
      street_address: address.street_address || "",
      city: address.city || "",
      province: address.province || "Nairobi",
      zip_code: address.zip_code || "",
      phone: address.phone || "",
      email: address.email || "",
      additional_info: address.additional_info || ""
    });
    setShowSavedAddresses(false);
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
          payment_method: paymentMethod || "mpesa",
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
      // Normalize: prefer billing phone if toggle is on
      const mpesaPhone = useBillingPhone ? (formData.phone || phoneNumber) : phoneNumber;
      console.log("Sending M-Pesa STK push request:", {
        phone_number: mpesaPhone,
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
          phone_number: mpesaPhone,
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

  const pollPaymentStatus = async (checkoutId) => {
    try {
      const resp = await fetch(`http://localhost:5000/payments/mpesa/status/${checkoutId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.status === "COMPLETED") {
        setPaymentStatus("success");
      } else if (data.status === "FAILED") {
        setPaymentStatus("failed");
      } else {
        setTimeout(() => pollPaymentStatus(checkoutId), 3000);
      }
    } catch (e) {
      console.error('Polling error:', e);
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
      if (paymentMethod === "mpesa") {
        const effectivePhone = useBillingPhone ? formData.phone : phoneNumber;
        if (!effectivePhone) {
          alert("Please provide a phone number for M-Pesa payment");
        setLoading(false);
        return;
        }
      }

      console.log("Creating order with data:", {
        shipping_address: `${formData.street_address}, ${formData.city}, ${formData.province}, ${formData.country}`,
        payment_method: paymentMethod,
        billing_details: formData
      });

      // Save shipping information if user wants to
      if (saveForLater) {
        await saveShippingInfo(formData, true); // Save as default
      }

      // Create order
      const orderId = await createOrder(formData);
      console.log("Order created successfully with ID:", orderId);
      
      // Initiate payment based on method
      if (paymentMethod === "mpesa") {
        try {
          console.log("Initiating M-Pesa payment for order:", orderId);
          console.log("Payment amount:", parseFloat(cartData.total_price));
          console.log("Phone number:", useBillingPhone ? formData.phone : phoneNumber);
          
          const paymentResult = await initiatePayment(orderId, parseFloat(cartData.total_price));
          console.log("M-Pesa payment result:", paymentResult);
          
          const checkoutId = paymentResult.checkout_request_id || paymentResult.CheckoutRequestID;
          if (checkoutId) {
            setCheckoutRequestId(checkoutId);
            setPaymentStatus("pending");
            
            // If it's a mock payment, show success immediately
            if (paymentResult.mock) {
              setTimeout(() => {
                setPaymentStatus("success");
                // Clear cart and redirect after showing success
                setTimeout(async () => {
            await cartService.clearCart();
            window.location.href = `/order-confirmation/${orderId}`;
                }, 2000);
              }, 1000);
            } else {
              pollPaymentStatus(checkoutId);
            }
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

  if (paymentStatus !== "idle") {
    return (
      <div className="billing-container">
        <PaymentStatus
          status={paymentStatus === 'pending' ? 'idle' : paymentStatus === 'success' ? 'success' : 'failed'}
          amount={parseFloat(cartData?.total_price || 0).toLocaleString()}
          transactionId={checkoutRequestId}
          onReset={() => {
            setPaymentStatus('idle');
            setCheckoutRequestId(null);
          }}
        />
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
                src={getPrimaryImageUrl(item)}
                alt={item.product_name}
                className="order-item-img"
                onError={(e) => {
                  console.error('Image failed to load for billing item:', item.cart_item_id, 'URL:', e.target.src);
                  // Show placeholder on error
                  e.target.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'order-item-img-placeholder';
                  placeholder.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21,15 16,10 5,21"></polyline></svg>';
                  e.target.parentNode.insertBefore(placeholder, e.target);
                }}
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
        <div className="billing-header">
          <h3>Billing Details</h3>
          {savedShippingInfo.length > 0 && (
            <button
              type="button"
              className="saved-addresses-btn"
              onClick={() => setShowSavedAddresses(!showSavedAddresses)}
            >
              <FaHistory className="icon" />
              {showSavedAddresses ? 'Hide' : 'Show'} Saved Addresses ({savedShippingInfo.length})
            </button>
          )}
        </div>

        {showSavedAddresses && savedShippingInfo.length > 0 && (
          <div className="saved-addresses">
            <h4>Saved Addresses</h4>
            <div className="address-list">
              {savedShippingInfo.map((address) => (
                <div key={address.id} className="address-item">
                  <div className="address-info">
                    <strong>{address.first_name} {address.last_name}</strong>
                    {address.is_default && <span className="default-badge">Default</span>}
                    <p>{address.street_address}, {address.city}, {address.province}</p>
                    <p>{address.country} - {address.zip_code}</p>
                    <p>{address.phone} | {address.email}</p>
                  </div>
                  <button
                    type="button"
                    className="use-address-btn"
                    onClick={() => loadSavedAddress(address)}
                  >
                    Use This Address
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
            <div className="mpesa-card">
              <div className="mpesa-header">
                <div className="mpesa-title">Lipa na M-Pesa</div>
                <div className="mpesa-subtitle">You will receive an STK push on your phone</div>
              </div>

              <div className="mpesa-phone-row">
                <label className="mpesa-toggle">
                  <input
                    type="checkbox"
                    checked={useBillingPhone}
                    onChange={(e) => setUseBillingPhone(e.target.checked)}
                  />
                  <span>Use billing phone ({formData.phone || 'not set'})</span>
                </label>
              </div>

              {!useBillingPhone && (
                <div className="input-group mpesa-phone-input">
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

              <div className="mpesa-hint">Ensure your phone is on and has network. Standard M-Pesa charges may apply.</div>
            </div>
          )}
        </div>

        {/* Save for Later Option */}
        <div className="save-option">
          <label className="save-checkbox">
            <input
              type="checkbox"
              checked={saveForLater}
              onChange={(e) => setSaveForLater(e.target.checked)}
            />
            <FaSave className="icon" />
            <span>Save this address for future orders</span>
          </label>
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
