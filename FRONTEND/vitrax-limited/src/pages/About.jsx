import React, { useEffect, useState } from 'react';
import AboutHero from '../components/AboutHero';
import AboutStory from '../components/AboutStory';
import AboutCTA from '../components/AboutCTA';
import './About.css';

const About = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

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
    
    // Add smooth scrolling for anchor links
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Add click listeners to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });

    // Handle navigation dot clicks
    const handleNavDotClick = (section) => {
      const element = document.querySelector(`.about-${section}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    // Add click listeners to navigation dots
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const section = dot.getAttribute('data-section');
        handleNavDotClick(section);
      });
    });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
      navDots.forEach(dot => {
        dot.removeEventListener('click', handleNavDotClick);
      });
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
        >
          <span className="dot-tooltip">Hero</span>
        </div>
        <div 
          className={`nav-dot ${activeSection === 'story' ? 'active' : ''}`} 
          data-section="story"
        >
          <span className="dot-tooltip">Our Story</span>
        </div>
        <div 
          className={`nav-dot ${activeSection === 'cta' ? 'active' : ''}`} 
          data-section="cta"
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




