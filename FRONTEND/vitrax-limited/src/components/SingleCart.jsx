import React, { useState, useEffect } from "react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { cartService } from "./cartService";
import { getPrimaryImageUrl, handleImageError } from "../utils/imageUtils";
import './SingleCart.css';

const SingleCart = () => {
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
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    
    try {
      await cartService.removeFromCart(itemId);
      await fetchCart();
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
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-spinner">Loading cart...</div>
      </div>
    );
  }

  const cartItems = cartData?.items || [];
  const subtotal = parseFloat(cartData?.total_price || "0.00");

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Cart Items Table */}
      <div className="cart-items">
        <div className="cart-header">
          <h2>Shopping Cart ({cartData?.items_count || 0} items)</h2>
          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.cart_item_id}>
                <td className="cart-item">
                  <img 
                    src={getPrimaryImageUrl(item)}
                    alt={item.product_name} 
                    className="cart-item-img"
                    onError={(e) => handleImageError(e)}
                  />
                  <div className="item-details">
                    <span className="item-name">{item.product_name}</span>
                    <span className="item-description">{item.description}</span>
                  </div>
                </td>
                <td className="item-price">KSh {(parseFloat(item.price) || 0).toLocaleString()}</td>
                <td className="quantity-cell">
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
                  {updating[item.cart_item_id] && <span className="updating">Updating...</span>}
                </td>
                <td className="item-subtotal">
                  KSh {(parseFloat(item.price) * item.quantity).toLocaleString()}
                </td>
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleRemoveItem(item.cart_item_id)}
                    title="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Summary Section */}
      <div className="cart-summary">
        <h3>Cart Totals</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>KSh {subtotal.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>KSh {subtotal.toLocaleString()}</span>
        </div>
        <button 
          className="checkout-btn" 
          onClick={() => navigate("/checkout")}
          disabled={cartItems.length === 0}
        >
          Proceed to Checkout
        </button>
        <button 
          className="continue-shopping-btn" 
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default SingleCart;
