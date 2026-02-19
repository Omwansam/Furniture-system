import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaUser, 
  FaHeart, 
  FaShoppingCart, 
  FaFacebook, 
  FaInstagram, 
  FaYoutube,
  FaChevronDown,
  FaTachometerAlt,
  FaBox,
  FaDownload,
  FaMapMarkerAlt,
  FaUserCog,
  FaTicketAlt,
  FaHeart as FaWishlist,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import CartPopup from './CartPopup';
import FavoritesPopup from './FavoritesPopup';
import Logo from '../assets/Logo.png';

const Navbar = () => {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { itemsCount, isCartOpen, openCart, closeCart } = useCart();
  const { favoritesCount } = useFavorites();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    console.log('Current user:', user);
    setIsAccountDropdownOpen(false);
    navigate(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/">
            <img src={Logo} alt="Vitrax Limited" className="logo-image" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="nav-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        {/* Main Navigation Menu */}
        <div className="nav-menu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>Shop</Link>
          <Link to="/blog" className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}>Blog</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </div>

        {/* Right Side Actions */}
        <div className="nav-actions">
          {/* Login/My Account Button */}
          <div className="account-section" ref={dropdownRef}>
            {user ? (
              <div className="account-dropdown-container">
                <button 
                  className="account-btn"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                >
                  <FaUser className="account-icon" />
                  <span>My Account</span>
                  <FaChevronDown className={`dropdown-arrow ${isAccountDropdownOpen ? 'rotated' : ''}`} />
                </button>
                
                {isAccountDropdownOpen && (
                  <div className="account-dropdown">
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/dashboard')}
                    >
                      <FaTachometerAlt className="dropdown-icon" />
                      Dashboard
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/orders')}
                    >
                      <FaBox className="dropdown-icon" />
                      Orders
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/downloads')}
                    >
                      <FaDownload className="dropdown-icon" />
                      Downloads
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/addresses')}
                    >
                      <FaMapMarkerAlt className="dropdown-icon" />
                      Addresses
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/account-details')}
                    >
                      <FaUserCog className="dropdown-icon" />
                      Account Details
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/coupons')}
                    >
                      <FaTicketAlt className="dropdown-icon" />
                      My Coupons
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/wishlist')}
                    >
                      <FaWishlist className="dropdown-icon" />
                      Wishlist
                    </button>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <FaSignOutAlt className="dropdown-icon" />
                      Logout
            </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <FaUser className="login-icon" />
                <span>Login</span>
          </Link>
            )}
          </div>

          {/* Cart Button */}
          <button 
            className="cart-btn" 
            onClick={openCart}
          >
            <FaShoppingCart className="cart-icon" />
            <span>Cart</span>
            {itemsCount > 0 && (
              <span className="cart-badge">{itemsCount}</span>
            )}
          </button>

          {/* Favorites Button */}
          <button 
            className="favorites-btn" 
            onClick={() => setIsFavoritesOpen(true)}
          >
            <FaHeart className="favorites-icon" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="favorites-badge">{favoritesCount}</span>
            )}
          </button>

          {/* Social Media Icons */}
          <div className="nav-social" aria-label="Social links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="nav-social-link nav-social-facebook" aria-label="Facebook">
              <FaFacebook className="nav-social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nav-social-link nav-social-instagram" aria-label="Instagram">
              <FaInstagram className="nav-social-icon" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="nav-social-link nav-social-youtube" aria-label="YouTube">
              <FaYoutube className="nav-social-icon" />
            </a>
          </div>
        </div>
      </div>

      {/* Cart Popup */}
      {isCartOpen && (
        <CartPopup 
          onClose={closeCart} 
          onCartUpdate={() => {
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
