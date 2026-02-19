import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPhone, FaEnvelope } from 'react-icons/fa';
import './AboutCTA.css';

const AboutCTA = () => {
  return (
    <div className="about-cta">
      <div className="cta-background">
        <div className="cta-pattern"></div>
        <div className="cta-glow"></div>
      </div>

      <div className="cta-container">
        <div className="cta-content">
          <div className="cta-text">
            <h2 className="cta-title">
              Ready to Transform
              <span className="highlight"> Your Space?</span>
            </h2>
            
            <p className="cta-description">
              Let's work together to create the perfect furniture solution for your home or business. 
              Our team of experts is ready to bring your vision to life with custom designs, 
              premium materials, and exceptional craftsmanship.
            </p>

            <div className="cta-features">
              <div className="feature">
                <div className="feature-icon">✨</div>
                <span>Custom Design Solutions</span>
              </div>
              <div className="feature">
                <div className="feature-icon">🏆</div>
                <span>Premium Quality Materials</span>
              </div>
              <div className="feature">
                <div className="feature-icon">🚚</div>
                <span>Free Delivery & Installation</span>
              </div>
            </div>

            <div className="cta-actions">
              <Link to="/shop" className="cta-primary-btn">
                <span>Explore Our Collection</span>
                <FaArrowRight className="arrow-icon" />
                <div className="btn-glow"></div>
              </Link>
              
              <Link to="/contact" className="cta-secondary-btn">
                <span>Get Free Consultation</span>
                <div className="btn-glow"></div>
              </Link>
            </div>
          </div>

          <div className="cta-contact">
            <div className="contact-card">
              <h3>Get In Touch</h3>
              <p>Ready to start your furniture journey? Contact us today!</p>
              
              <div className="contact-methods">
                <a href="tel:+254700123456" className="contact-method">
                  <div className="method-icon">
                    <FaPhone />
                  </div>
                  <div className="method-info">
                    <span className="method-label">Call Us</span>
                    <span className="method-value">+254 700 123 456</span>
                  </div>
                </a>
                
                <a href="mailto:info@vitrax.co.ke" className="contact-method">
                  <div className="method-icon">
                    <FaEnvelope />
                  </div>
                  <div className="method-info">
                    <span className="method-label">Email Us</span>
                    <span className="method-value">info@vitrax.co.ke</span>
                  </div>
                </a>
              </div>

              <div className="contact-hours">
                <h4>Business Hours</h4>
                <div className="hours-list">
                  <div className="hour-item">
                    <span className="day">Monday - Friday</span>
                    <span className="time">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hour-item">
                    <span className="day">Saturday</span>
                    <span className="time">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="hour-item">
                    <span className="day">Sunday</span>
                    <span className="time">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCTA;
