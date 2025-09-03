import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { cartService } from "./cartService";
import { handleAuthError } from "../utils/authUtils";
import { getPrimaryImageUrl } from "../utils/imageUtils";
import "./CartPopup.css";

const CartPopup = ({ onClose, onCartUpdate }) => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});


  console.log("CartPopup rendered with onClose:", onClose);

  useEffect(() => {
    console.log("CartPopup useEffect triggered");
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      console.log('Cart data received:', data);
      console.log('Cart items:', data?.items);
      if (data?.items) {
        data.items.forEach((item, index) => {
          console.log(`Item ${index}:`, {
            name: item.product_name,
            image_url: item.image_url,
            primary_image_url: getPrimaryImageUrl(item)
          });
        });
      }
      setCartData(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.message && error.message.includes('Authentication failed')) {
        handleAuthError(window.location.pathname, navigate, "Please login to view your cart");
        return;
      }
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
      if (error.message && error.message.includes('Authentication failed')) {
        handleAuthError(window.location.pathname, navigate, "Please login to manage your cart");
        return;
      }
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
      if (error.message && error.message.includes('Authentication failed')) {
        handleAuthError(window.location.pathname, navigate, "Please login to manage your cart");
        return;
      }
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
      if (error.message && error.message.includes('Authentication failed')) {
        handleAuthError(window.location.pathname, navigate, "Please login to manage your cart");
        return;
      }
      alert('Failed to clear cart. Please try again.');
    }
  };



  const renderProductImage = (item) => {
    const imageUrl = getPrimaryImageUrl(item);
    
    console.log('Rendering image for item:', item.cart_item_id, 'URL:', imageUrl);
    
    return (
      <img
        src={imageUrl}
        alt={item.product_name || 'Product image'}
        className="cart-item-img"
        onError={(e) => {
          console.error('Image failed to load for item:', item.cart_item_id, 'URL:', e.target.src);
          // Show placeholder on error
          e.target.style.display = 'none';
          const placeholder = document.createElement('div');
          placeholder.className = 'cart-item-img-placeholder';
          placeholder.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21,15 16,10 5,21"></polyline></svg>';
          e.target.parentNode.insertBefore(placeholder, e.target);
        }}
        onLoad={() => console.log('Image loaded successfully for item:', item.cart_item_id, 'URL:', imageUrl)}
      />
    );
  };

  if (loading) {
    return (
      <div className="cart-popup-overlay">
        <div className="cart-popup">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
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
          {cartItems.map((item) => {
            return (
              <div key={item.cart_item_id} className="cart-item">
                {renderProductImage(item)}
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
          );
        })}
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

