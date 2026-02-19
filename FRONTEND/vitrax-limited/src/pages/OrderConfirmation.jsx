import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiShoppingBag } from 'react-icons/fi';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch order details from the backend
    // For now, we'll just show the order ID
    setOrderDetails({ order_id: orderId });
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">
          <FiCheckCircle />
        </div>
        
        <h1>Order Confirmed!</h1>
        <p className="order-id">Order ID: #{orderDetails?.order_id}</p>
        
        <div className="confirmation-message">
          <p>Thank you for your order! We've received your payment and will begin processing your order immediately.</p>
          <p>You will receive an email confirmation with your order details and tracking information.</p>
        </div>

        <div className="next-steps">
          <h3>What happens next?</h3>
          <ul>
            <li>We'll process your order within 24 hours</li>
            <li>You'll receive shipping confirmation via email</li>
            <li>Your order will be delivered within 3-5 business days</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/shop')}
          >
            <FiShoppingBag /> Continue Shopping
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            <FiHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
