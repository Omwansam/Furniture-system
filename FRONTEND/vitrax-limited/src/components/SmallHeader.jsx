import React, { useState, useEffect } from 'react';
import './SmallHeader.css';
import { FaTruck, FaShoppingCart, FaPhone, FaWhatsapp } from 'react-icons/fa';

const SmallHeader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = [
    {
      text: "Delivery in just 24 hours - exclusively online",
      icon: <FaTruck className="message-icon" />
    },
    {
      text: "Experience the speed of shopping online",
      icon: <FaShoppingCart className="message-icon" />
    },
    {
      text: "To make purchase online, Call/WhatsApp 0114080686",
      icon: <div className="contact-icons">
        <FaPhone className="message-icon" />
        <FaWhatsapp className="message-icon" />
      </div>
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="small-header">
      <div className="small-header-container">
        <div className="rotating-message">
          <div className="message-content">
            {messages[currentIndex].icon}
            <span className="message-text">{messages[currentIndex].text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallHeader;
