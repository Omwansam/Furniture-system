import React from 'react';
import { FaStar, FaAward, FaUsers, FaGlobe } from 'react-icons/fa';
import './AboutHero.css';

const AboutHero = () => {
  const stats = [
    { icon: FaStar, value: "15+", label: "Years Experience", color: "#fbbf24" },
    { icon: FaAward, value: "500+", label: "Projects Completed", color: "#10b981" },
    { icon: FaUsers, value: "10K+", label: "Happy Customers", color: "#3b82f6" },
    { icon: FaGlobe, value: "25+", label: "Countries Served", color: "#8b5cf6" }
  ];

  return (
    <div className="about-hero">
      <div className="hero-background">
        <div className="floating-elements">
          <div className="element element-1"></div>
          <div className="element element-2"></div>
          <div className="element element-3"></div>
          <div className="element element-4"></div>
          <div className="element element-5"></div>
          <div className="element element-6"></div>
        </div>
        <div className="grid-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <div className="badge">
            <span className="badge-text">About Vitrax Limited</span>
          </div>
          
          <h1 className="hero-title">
            Crafting Dreams Into
            <span className="highlight"> Reality</span>
          </h1>
          
          <p className="hero-description">
            We are a premier furniture and home decor company based in Nairobi, Kenya, 
            dedicated to transforming living spaces with innovative designs, quality craftsmanship, 
            and exceptional customer service. Our journey began with a simple vision: to make 
            beautiful, functional furniture accessible to everyone.
          </p>

          <div className="hero-actions">
            <button className="primary-btn">
              <span>Explore Our Story</span>
              <div className="btn-glow"></div>
            </button>
            <button className="secondary-btn">
              <span>Watch Our Journey</span>
              <div className="play-icon">▶</div>
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-container">
            <div className="main-image">
              <div className="image-placeholder">
                <div className="image-glow"></div>
                <div className="floating-card card-1">
                  <div className="card-icon">🏆</div>
                  <div className="card-text">Award Winning</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">✨</div>
                  <div className="card-text">Premium Quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stats-container">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="stat-item" style={{ '--stat-color': stat.color }}>
                <div className="stat-icon">
                  <IconComponent />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                <div className="stat-glow"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
