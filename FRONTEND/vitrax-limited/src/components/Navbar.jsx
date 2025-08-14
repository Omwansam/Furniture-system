import React, { useState } from 'react';
import './Navbar.css';
import { Link } from "react-router-dom";
import { FaUser, FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartPopup from './CartPopup';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle visibility of the search input
  const { user } = useAuth();
  const { itemsCount, isCartOpen, openCart, closeCart, cartItems } = useCart();

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
          <button className="icon-btn">
            <FaHeart className="icon" />
          </button>

          {/* Shopping Cart Icon */}
          <button className="icon-btn cart-icon" onClick={openCart}>
            <FaShoppingCart className="icon" />
            {itemsCount > 0 && (
              <span className="cart-badge">{itemsCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Cart Popup */}
      {isCartOpen && (
        <CartPopup 
          cartItems={cartItems} 
          onClose={closeCart} 
        />
      )}
    </nav>
  );
};

export default Navbar;

