import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import "./ContactForm.css";

const ContactForm = () => {
  return (
    <div className="contact-container">
      <h2>Get In Touch With Us</h2>
      <p className="subtitle">
        For more information about our products & services, please feel free to drop us an email.
        Our staff is always there to help you out. Do not hesitate!
      </p>

      <div className="contact-content">
        {/* Left Section - Contact Info */}
        <div className="contact-info">
          <div className="contact-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h4>Address</h4>
              <p>220 St & 5th Avenue, New York 10003, United States</p>
            </div>
          </div>

          <div className="contact-item">
            <FaPhoneAlt className="icon" />
            <div>
              <h4>Phone</h4>
              <p>Mobile: (+64) 546-6788</p>
              <p>Hotline: (+64) 546-6789</p>
            </div>
          </div>

          <div className="contact-item">
            <FaClock className="icon" />
            <div>
              <h4>Working Time</h4>
              <p>Monday-Friday: 9:00 - 22:00</p>
              <p>Saturday-Sunday: 9:00 - 23:00</p>
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <form className="contact-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Email address" />
          <input type="text" placeholder="Subject (This is an optional)" />
          <textarea placeholder="Message"></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
