import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { getPrimaryImageUrl, handleImageError } from '../utils/imageUtils';
import './FavoritesPopup.css';

const FavoritesPopup = ({ onClose }) => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleRemoveFromFavorites = (productId) => {
    void removeFromFavorites(productId);
  };

  const formatPrice = (price) => {
    const n = Number(price);
    if (Number.isNaN(n)) return "—";
    return `Ksh ${n.toLocaleString()}`;
  };

  return (
    <div className="favorites-popup-overlay" onClick={onClose}>
      <div className="favorites-popup" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="favorites-header">
          <h3>My Favorites ({favorites.length})</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="favorites-content">
          {favorites.length === 0 ? (
            <div className="empty-favorites">
              <FaHeart className="empty-icon" />
              <h4>No favorites yet</h4>
              <p>Start adding products to your favorites to see them here!</p>
              <Link to="/shop" className="browse-btn" onClick={onClose}>
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="favorites-list">
                {favorites.map((product) => {
                  const pid = product.product_id ?? product.id;
                  return (
                  <div key={pid} className="favorite-item">
                    <div className="favorite-image">
                      <img 
                        src={getPrimaryImageUrl(product)} 
                        alt={product.product_name || product.name || "Product"}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                    
                    <div className="favorite-details">
                      <h4 className="favorite-name">{product.product_name || product.name}</h4>
                      <p className="favorite-price">{formatPrice(product.product_price ?? product.price)}</p>
                      <div className="favorite-actions">
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                        <button 
                          className="remove-favorite-btn"
                          onClick={() => handleRemoveFromFavorites(pid)}
                        >
                          <FaHeart /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
              
              <div className="favorites-footer">
                <button 
                  className="clear-favorites-btn"
                  type="button"
                  onClick={() => void clearFavorites()}
                >
                  Clear All Favorites
                </button>
                <Link to="/shop" className="continue-shopping-btn" onClick={onClose}>
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPopup;
