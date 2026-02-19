import React, { useState, useEffect } from 'react';
import ContactForm from '../components/ContactForm';
import ContactMap from '../components/ContactMap';
import ContactSocialMedia from '../components/ContactSocialMedia';
import { contactService, getFallbackContactInfo, getFallbackSocialMedia } from '../components/contactService';
import './Contact.css';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [socialMedia, setSocialMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        // Try to fetch from backend
        const [contactData, socialData] = await Promise.all([
          contactService.getContactInfo(),
          contactService.getSocialMedia()
        ]);
        
        setContactInfo(contactData);
        setSocialMedia(socialData);
      } catch (error) {
        console.log('Using fallback contact data');
        // Use fallback data if backend is not available
        setContactInfo(getFallbackContactInfo());
        setSocialMedia(getFallbackSocialMedia());
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return (
      <div className="contact-page">
        <div className="contact-loading">
          <div className="loading-spinner"></div>
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-content">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="contact-section">
        <ContactForm contactInfo={contactInfo} />
      </div>

      {/* Map Section */}
      <div className="contact-section">
        <ContactMap contactInfo={contactInfo} />
      </div>

      {/* Social Media Section */}
      <div className="contact-section">
        <ContactSocialMedia socialMedia={socialMedia} />
      </div>

      {/* Additional Info Section */}
      <div className="contact-section">
        <div className="contact-cta">
          <div className="cta-content">
            <h2>Ready to Transform Your Space?</h2>
            <p>Visit our showroom in Nairobi to explore our complete collection of premium furniture and home decor.</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">Schedule a Visit</button>
              <button className="cta-btn secondary">Download Catalog</button>
            </div>
          </div>
          <div className="cta-visual">
            <div className="cta-image-placeholder">
              <div className="image-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
