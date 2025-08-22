import React, { useState } from 'react'
import './Footer.css'
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { subscribeToNewsletter } from './newsletterService';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscriptionStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus(null);

    try {
      const result = await subscribeToNewsletter(email);
      setSubscriptionStatus({ type: 'success', message: result.message });
      setEmail('');
    } catch (error) {
      setSubscriptionStatus({ type: 'error', message: 'Failed to subscribe. Please try again.' });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className='footer'>
      <div className='footer-container'>
        {/* Company Info Section */}
        <div className='footer-column company-info'>
          <h4 className='footer-title'>Vitrax Limited</h4>
          <p className='footer-subtitle'>Your trusted partner for premium furniture and home decor solutions.</p>
          
          <div className='contact-info'>
            <div className='contact-item'>
              <FaMapMarkerAlt className='contact-icon' />
              <span>400 University Drive Suite 200, Coral Gables, FL 33134 USA</span>
            </div>
            <div className='contact-item'>
              <FaPhone className='contact-icon' />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className='contact-item'>
              <FaEnvelope className='contact-icon' />
              <span>info@vitrax.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className='footer-column'>
          <h4>Quick Links</h4>
          <ul className='footer-links'>
            <li><Link to="/" className='footer-link'>Home</Link></li>
            <li><Link to="/shop" className='footer-link'>Shop</Link></li>
            <li><Link to="/blog" className='footer-link'>Blog</Link></li>
            <li><Link to="/about" className='footer-link'>About Us</Link></li>
            <li><Link to="/contact" className='footer-link'>Contact</Link></li>
          </ul>
        </div>

        {/* Help Section */}
        <div className='footer-column'>
          <h4>Help & Support</h4>
          <ul className='footer-links'>
            <li><Link to="/shipping" className='footer-link'>Shipping Info</Link></li>
            <li><Link to="/returns" className='footer-link'>Returns & Exchanges</Link></li>
            <li><Link to="/faq" className='footer-link'>FAQ</Link></li>
            <li><Link to="/size-guide" className='footer-link'>Size Guide</Link></li>
            <li><Link to="/care-instructions" className='footer-link'>Care Instructions</Link></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className='footer-column newsletter'>
          <h4>Newsletter</h4>
          <p className='newsletter-description'>Subscribe to get special offers, free giveaways, and updates on new arrivals.</p>
          
          <form onSubmit={handleNewsletterSubmit} className='newsletter-form'>
            <div className='newsletter-input'>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
              />
              <button 
                type="submit" 
                className='newsletter-btn'
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            
            {subscriptionStatus && (
              <div className={`subscription-message ${subscriptionStatus.type}`}>
                {subscriptionStatus.message}
              </div>
            )}
          </form>

          <div className='social-links'>
            <h5>Follow Us</h5>
            <div className='social-icons'>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className='social-link'>
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className='social-link'>
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className='social-link'>
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className='social-link'>
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className='footer-bottom'>
        <div className='footer-bottom-content'>
          <p>&copy; 2025 Vitrax Limited. All rights reserved.</p>
          <div className='footer-bottom-links'>
            <Link to="/privacy" className='footer-bottom-link'>Privacy Policy</Link>
            <Link to="/terms" className='footer-bottom-link'>Terms of Service</Link>
            <Link to="/sitemap" className='footer-bottom-link'>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
