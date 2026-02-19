import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope, FaUser, FaPaperPlane } from "react-icons/fa";
import { submitContactForm } from './contactService';
import "./ContactForm.css";

const ContactForm = ({ contactInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    if (!formData.email.includes('@')) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitContactForm(formData);
      setSubmitStatus({ type: 'success', message: result.message });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch {
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form-header">
        <h2>Get In Touch With Us</h2>
        <p className="subtitle">
          For more information about our products & services, please feel free to drop us an email.
          Our staff is always there to help you out. Do not hesitate!
        </p>
      </div>

      <div className="contact-content">
        {/* Left Section - Contact Info */}
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="contact-details">
              <h4>Address</h4>
              <p>{contactInfo?.address?.full_address || 'Westlands Business District, Nairobi, Kenya'}</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>
            <div className="contact-details">
              <h4>Phone</h4>
              <p>Mobile: {contactInfo?.phone?.primary || '+254 700 123 456'}</p>
              <p>Hotline: {contactInfo?.phone?.secondary || '+254 733 123 456'}</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">
              <FaEnvelope />
            </div>
            <div className="contact-details">
              <h4>Email</h4>
              <p>Primary: {contactInfo?.email?.primary || 'info@vitrax.co.ke'}</p>
              <p>Support: {contactInfo?.email?.support || 'support@vitrax.co.ke'}</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">
              <FaClock />
            </div>
            <div className="contact-details">
              <h4>Working Time</h4>
              <p>{contactInfo?.working_hours?.weekdays || 'Monday-Friday: 8:00 AM - 6:00 PM'}</p>
              <p>{contactInfo?.working_hours?.weekends || 'Saturday: 9:00 AM - 4:00 PM'}</p>
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name *" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <div className="input-icon">
                  <FaEnvelope />
                </div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address *" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <div className="input-icon">
                  <FaPhoneAlt />
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number (Optional)" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <div className="input-icon">
                  <FaPaperPlane />
                </div>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Subject (Optional)" 
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="textarea-wrapper">
                <textarea 
                  name="message"
                  placeholder="Your Message *" 
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                ></textarea>
              </div>
            </div>

            {submitStatus && (
              <div className={`submit-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Sending Message...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
