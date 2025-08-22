import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { cartService } from "./cartService";
import "./CartPopup.css";

const CartPopup = ({ onClose, onCartUpdate }) => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

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
      setCartData({ items: [], total_price: "0.00", items_count: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }));
      await cartService.updateCartItem(itemId, newQuantity);
      await fetchCart();
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      await fetchCart();
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      await cartService.clearCart();
      await fetchCart();
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };



  if (loading) {
    return (
      <div className="cart-popup-overlay">
        <div className="cart-popup">
          <div className="loading-spinner">Loading cart...</div>
        </div>
      </div>
    );
  }

  const cartItems = cartData?.items || [];
  const subtotal = parseFloat(cartData?.total_price || "0.00");

  if (cartItems.length === 0) {
    return (
      <div className="cart-popup-overlay">
        <div className="cart-popup">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-popup-overlay">
      <div className="cart-popup">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <span className="cart-count">({cartData?.items_count || 0} item{(cartData?.items_count || 0) !== 1 ? 's' : ''})</span>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div key={item.cart_item_id} className="cart-item">
              <img
                src={
                  item.image_url?.startsWith('http') 
                    ? item.image_url 
                    : `http://localhost:5000/${item.image_url || '/placeholder-image.jpg'}`
                }
                alt={item.product_name || 'Product image'}
                className="cart-item-img"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <div className="cart-item-details">
                <h3>{item.product_name || 'Unknown Product'}</h3>
                <p className="cart-price">
                  KSh {(parseFloat(item.price) || 0).toLocaleString()}
                </p>
                
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                    disabled={updating[item.cart_item_id] || item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                    disabled={updating[item.cart_item_id] || item.quantity >= item.max_allowed}
                  >
                    <FiPlus />
                  </button>
                </div>
                
                <p className="item-total">
                  Total: KSh {(parseFloat(item.price) * item.quantity).toLocaleString()}
                </p>
              </div>
              
              <button 
                className="remove-item-btn"
                onClick={() => handleRemoveItem(item.cart_item_id)}
                title="Remove item"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-subtotal">
          <p>
            <strong>Subtotal:</strong> KSh {subtotal.toLocaleString()}
          </p>
        </div>

        <div className="cart-actions">
          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-pop-buttons">
          <button 
            className="view-cart-btn" 
            onClick={() => {
              console.log("View Cart clicked");
              onClose();
              console.log("Navigating to /cart");
              navigate("/cart");
            }}
          >
            View Cart
          </button>
          <button
            className="checkout-pop-btn"
            onClick={() => {
              console.log("Checkout clicked");
              onClose();
              console.log("Navigating to /checkout");
              navigate("/checkout");
            }}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;

