import React, { useEffect, useState } from 'react';
import AboutHero from '../components/AboutHero';
import AboutStory from '../components/AboutStory';
import AboutCTA from '../components/AboutCTA';
import './About.css';

const About = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  const handleNavDotClick = (section) => {
    const element = document.querySelector(`.about-${section}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Handle scroll progress
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);

      // Update active section based on scroll position
      const sections = ['hero', 'story', 'cta'];
      const sectionElements = sections.map(section => 
        document.querySelector(`.about-${section}`)
      );

      let currentSection = 'hero';
      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = sections[index];
          }
        }
      });

      setActiveSection(currentSection);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <AboutHero />
      
      {/* Story Section */}
      <AboutStory />
      
      {/* Call to Action Section */}
      <AboutCTA />
      
      {/* Floating Navigation Dots */}
      <div className="floating-nav">
        <div 
          className={`nav-dot ${activeSection === 'hero' ? 'active' : ''}`} 
          data-section="hero"
          onClick={() => handleNavDotClick('hero')}
        >
          <span className="dot-tooltip">Hero</span>
        </div>
        <div 
          className={`nav-dot ${activeSection === 'story' ? 'active' : ''}`} 
          data-section="story"
          onClick={() => handleNavDotClick('story')}
        >
          <span className="dot-tooltip">Our Story</span>
        </div>
        <div 
          className={`nav-dot ${activeSection === 'cta' ? 'active' : ''}`} 
          data-section="cta"
          onClick={() => handleNavDotClick('cta')}
        >
          <span className="dot-tooltip">Get Started</span>
        </div>
      </div>
      
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default About;




