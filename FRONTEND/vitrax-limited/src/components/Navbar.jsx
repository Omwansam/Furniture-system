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
  FaBars,
  FaTimes,
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    setIsAccountDropdownOpen(false);
    navigate(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/shop?q=${encodeURIComponent(q)}`);
    else navigate("/shop");
    setIsMobileOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
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

        {/* Hamburger (mobile) */}
        <button
          className="hamburger-btn"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Main Navigation Menu */}
        <div className="nav-menu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/shop" className={`nav-link ${location.pathname.startsWith('/shop') ? 'active' : ''}`}>Shop</Link>
          <Link to="/collections" className={`nav-link ${location.pathname === '/collections' ? 'active' : ''}`}>Collections</Link>
          <Link to="/blog" className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}>Blog</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </div>

        {/* Mobile drawer (renders on small screens when hamburger opened) */}
        {isMobileOpen && (
          <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
            <div className="mobile-menu-links">
              <Link to="/" onClick={() => setIsMobileOpen(false)} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
              <Link to="/shop" onClick={() => setIsMobileOpen(false)} className={`nav-link ${location.pathname.startsWith('/shop') ? 'active' : ''}`}>Shop</Link>
              <Link to="/collections" onClick={() => setIsMobileOpen(false)} className={`nav-link ${location.pathname === '/collections' ? 'active' : ''}`}>Collections</Link>
              <Link to="/blog" onClick={() => setIsMobileOpen(false)} className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}>Blog</Link>
              <Link to="/about" onClick={() => setIsMobileOpen(false)} className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
              <Link to="/contact" onClick={() => setIsMobileOpen(false)} className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
            </div>
            <div className="mobile-menu-actions">
              {user ? (
                <button className="account-btn" onClick={() => { setIsAccountDropdownOpen(!isAccountDropdownOpen); setIsMobileOpen(false); }}>
                  <FaUser className="account-icon" />
                  <span>Account</span>
                </button>
              ) : (
                <Link to="/login" className="login-btn" onClick={() => setIsMobileOpen(false)}>
                  <FaUser className="login-icon" />
                  <span>Login</span>
                </Link>
              )}

              <button className="cart-btn" onClick={() => { openCart(); setIsMobileOpen(false); }}>
                <FaShoppingCart className="cart-icon" />
                <span>Cart</span>
              </button>

              <button className="favorites-btn" onClick={() => { setIsFavoritesOpen(true); setIsMobileOpen(false); }}>
                <FaHeart className="favorites-icon" />
                <span>Favorites</span>
              </button>

              <div className="mobile-social">
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
        )}

        {/* Right Side Actions */}
        <div className="nav-actions">
          {/* Login/My Account Button */}
          <div className="account-section" ref={dropdownRef}>
            {user ? (
              <div className="account-dropdown-container">
                <button 
                  type="button"
                  className="account-btn"
                  aria-label="Account menu"
                  aria-expanded={isAccountDropdownOpen}
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                >
                  <FaUser className="account-icon" />
                  <span className="nav-label">My Account</span>
                  <FaChevronDown className={`dropdown-arrow nav-chevron ${isAccountDropdownOpen ? 'rotated' : ''}`} aria-hidden />
                </button>
                
                {isAccountDropdownOpen && (
                  <div className="account-dropdown">
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/account')}
                    >
                      <FaTachometerAlt className="dropdown-icon" />
                      Dashboard
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/account/orders')}
                    >
                      <FaBox className="dropdown-icon" />
                      Orders
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/account/downloads')}
                    >
                      <FaDownload className="dropdown-icon" />
                      Downloads
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/account/addresses')}
                    >
                      <FaMapMarkerAlt className="dropdown-icon" />
                      Addresses
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/account/settings')}
                    >
                      <FaUserCog className="dropdown-icon" />
                      Settings
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/account/coupons')}
                    >
                      <FaTicketAlt className="dropdown-icon" />
                      My Coupons
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleNavigation('/account/wishlist')}
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
              <Link to="/login" className="login-btn" aria-label="Log in">
                <FaUser className="login-icon" />
                <span className="nav-label">Login</span>
          </Link>
            )}
          </div>

          {/* Cart Button */}
          <button 
            type="button"
            className="cart-btn" 
            onClick={openCart}
            aria-label={itemsCount > 0 ? `Cart, ${itemsCount} items` : 'Shopping cart'}
          >
            <FaShoppingCart className="cart-icon" />
            <span className="nav-label">Cart</span>
            {itemsCount > 0 && (
              <span className="cart-badge">{itemsCount}</span>
            )}
          </button>

          {/* Favorites Button */}
          <button 
            type="button"
            className="favorites-btn" 
            onClick={() => setIsFavoritesOpen(true)}
            aria-label={favoritesCount > 0 ? `Wishlist, ${favoritesCount} items` : 'Wishlist'}
          >
            <FaHeart className="favorites-icon" />
            <span className="nav-label">Favorites</span>
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
