import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiPlay, FiPause } from 'react-icons/fi';
import './Hero.css';

// Import hero images
import hero1 from '../../assets/hero1.png';
import background1 from '../../assets/Background1.png';
import background2 from '../../assets/background2.png';
import sofaImage from '../../assets/SofaImage.png';
import sofa from '../../assets/Sofa.png';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef(null);

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: "Rocket Single Seater",
      subtitle: "Comfort meets style in every detail",
      description: "Experience ultimate comfort with our premium single seater chair. Perfect for your living space.",
      image: hero1,
      background: background1,
      ctaText: "Shop Now",
      ctaLink: "/shop",
      color: "#FBEBB5"
    },
    {
      id: 2,
      title: "Luxury Sofa Collection",
      subtitle: "Transform your living room",
      description: "Discover our exclusive collection of luxury sofas that combine elegance with unmatched comfort.",
      image: sofaImage,
      background: background2,
      ctaText: "Explore Collection",
      ctaLink: "/shop",
      color: "#E8F4FD"
    },
    {
      id: 3,
      title: "Modern Furniture Design",
      subtitle: "Contemporary elegance for your home",
      description: "Bring modern sophistication to your space with our carefully curated furniture collection.",
      image: sofa,
      background: background1,
      ctaText: "View Designs",
      ctaLink: "/shop",
      color: "#F0F8FF"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, heroSlides.length]);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className='hero-header' style={{ backgroundColor: currentSlideData.color }}>
      {/* Background Pattern */}
      <div className="hero-background-pattern"></div>
      
      {/* Floating Elements 
      <div className="floating-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-square square-1"></div>
        <div className="floating-square square-2"></div>
      </div> */}

      <div className='hero-container'>
        {/* Left Side - Image */}
        <div className={`hero-image ${isVisible ? 'animate-in' : ''}`}>
          <div className="image-container">
            <img 
              src={currentSlideData.image} 
              alt={currentSlideData.title}
              className="main-image"
            />

            {/* Image Overlay and Shadow 
            <div className="image-overlay"></div>
            <div className="image-shadow"></div>
            */}
          </div>
          


          {/* Background Image */}
          <div className="background-image">
            <img src={currentSlideData.background} alt="Background" />
          </div>
        </div>

        {/* Right Side - Text Content */}
        <div className={`hero-content-text ${isVisible ? 'animate-in' : ''}`}>
          <div className="slide-indicator">
            <span className="current-slide">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="total-slides">/{String(heroSlides.length).padStart(2, '0')}</span>
          </div>
          
          <h1 className='heading'>
            <span className="title-line">{currentSlideData.title}</span>
          </h1>
          
          <h2 className='subtitle'>{currentSlideData.subtitle}</h2>
          
          <p className='description'>{currentSlideData.description}</p>
          
          <div className="cta-section">
            <Link to={currentSlideData.ctaLink} className='shop-now-btn'>
              <span>{currentSlideData.ctaText}</span>
              <div className="btn-arrow">→</div>
            </Link>
            
            <div className="play-pause-controls">
              <button 
                className="play-pause-btn"
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="slide-dots">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        className="nav-arrow nav-prev" 
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <FiChevronLeft />
      </button>
      
      <button 
        className="nav-arrow nav-next" 
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <FiChevronRight />
      </button>

      {/* Progress Bar 
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
            transition: 'width 0.3s ease'
          }}
        ></div>
      </div>
      */}

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-text">Scroll to explore</div>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
};

export default Hero;
