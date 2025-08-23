import React, { useState } from 'react';
import './Navbar.css';
import { Link } from "react-router-dom";
import { FaUser, FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import CartPopup from './CartPopup';
import FavoritesPopup from './FavoritesPopup';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle visibility of the search input
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false); // Toggle visibility of favorites popup
  const { user } = useAuth();
  const { itemsCount, isCartOpen, openCart, closeCart, cartItems } = useCart();
  const { favoritesCount } = useFavorites();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/shop" className="nav-link">Shop</Link></li>
          <li><Link to="/blog" className="nav-link">Blog</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>

        {/* Right Side Icons */}
        <div className="nav-icons">
          {/* User Icon - Link to Login or SignUp */}
          <Link to={user ? "/login" : "/login"}>
            <button className="icon-btn">
              <FaUser className="icon" />
            </button>
          </Link>

          {/* Search Icon */}
          <button className="icon-btn search-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <FaSearch className="icon" />
          </button>

          {/* Search Input (Toggle Visibility) */}
          {isSearchOpen && <input type="text" placeholder="Search......." className="search-input" />}

          {/* Favourites Icon */}
          <button className="icon-btn favorites-icon" onClick={() => setIsFavoritesOpen(true)}>
            <FaHeart className="icon" />
            {favoritesCount > 0 && (
              <span className="favorites-badge">{favoritesCount}</span>
            )}
          </button>

          {/* Shopping Cart Icon */}
          <button 
            className="icon-btn cart-icon" 
            onClick={() => {
              console.log("Cart icon clicked, isCartOpen:", isCartOpen);
              openCart();
              console.log("After openCart, isCartOpen:", isCartOpen);
            }}
          >
            <FaShoppingCart className="icon" />
            {itemsCount > 0 && (
              <span className="cart-badge">{itemsCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Cart Popup */}
      {console.log("Rendering cart popup, isCartOpen:", isCartOpen)}
      {isCartOpen && (
        <CartPopup 
          onClose={closeCart} 
          onCartUpdate={() => {
            // This will trigger a cart refresh
            window.location.reload();
          }}
        />
      )}

      {/* Favorites Popup */}
      {isFavoritesOpen && (
        <FavoritesPopup 
          onClose={() => setIsFavoritesOpen(false)} 
        />
      )}
    </nav>
  );
};

export default Navbar;

