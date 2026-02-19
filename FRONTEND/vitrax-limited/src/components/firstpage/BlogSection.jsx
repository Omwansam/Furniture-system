import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Blog1 from '../../assets/Blog1.png'
import Blog2 from '../../assets/Blog2.png'
import Blog3 from '../../assets/Blog3.png'
import { FiClock } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import './BlogSection.css'

const blogPosts = [
    {
        id: 1,
        title: "Going all-in with millennial design",
        excerpt: "Discover how modern furniture design embraces millennial aesthetics with clean lines, sustainable materials, and multifunctional pieces that transform living spaces.",
        image: Blog1,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 2,
        title: "Sustainable furniture for eco-conscious homes",
        excerpt: "Explore the latest trends in eco-friendly furniture that combines style with sustainability, featuring reclaimed wood and recycled materials.",
        image: Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 3,
        title: "Maximizing small spaces with smart furniture",
        excerpt: "Learn innovative design solutions for compact living spaces, including space-saving furniture that maximizes functionality without compromising style.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 4,
        title: "The art of mixing modern and vintage styles",
        excerpt: "Master the technique of blending contemporary furniture with vintage pieces to create unique, timeless interiors that reflect your personal style.",
        image: Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 5,
        title: "Color psychology in furniture selection",
        excerpt: "Understand how different colors affect mood and atmosphere in your home, and choose furniture that creates the perfect ambiance for each room.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 6,
        title: "Luxury furniture on a budget",
        excerpt: "Discover smart shopping strategies and design tips to achieve a high-end look without breaking the bank, including DIY upgrades and thrift finds.",
        image: Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 7,
        title: "Ergonomic furniture for home offices",
        excerpt: "Create a productive workspace with ergonomic furniture designed for comfort and efficiency, essential for the modern remote work lifestyle.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 8,
        title: "Outdoor furniture trends for 2024",
        excerpt: "Stay ahead with the latest outdoor furniture trends, featuring weather-resistant materials and designs that extend your living space outdoors.",
        image: Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 9,
        title: "Minimalist furniture design principles",
        excerpt: "Embrace the minimalist philosophy with furniture that emphasizes simplicity, functionality, and quality over quantity in your home decor.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 10,
        title: "Custom furniture: when to invest",
        excerpt: "Learn when custom furniture is worth the investment and how to work with designers to create pieces perfectly tailored to your space and needs.",
        image: Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 11,
        title: "Furniture maintenance and care tips",
        excerpt: "Extend the life of your furniture with proper maintenance techniques, from cleaning different materials to protecting against wear and damage.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 12,
        title: "Smart furniture for the connected home",
        excerpt: "Explore the future of furniture with integrated technology, from charging stations to smart storage solutions that enhance modern living.",
        image: Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
];

const BlogSection = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 because of duplicate at start
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const cardsPerView = 2;
  const totalSlides = Math.ceil(blogPosts.length / cardsPerView);

  // Create slides with duplicates for infinite loop
  const createSlides = () => {
    const slides = [];
    // Add duplicate of last slide at the beginning
    const lastSlideIndex = totalSlides - 1;
    slides.push(blogPosts.slice(lastSlideIndex * cardsPerView, lastSlideIndex * cardsPerView + cardsPerView));
    
    // Add all original slides
    for (let i = 0; i < totalSlides; i++) {
      slides.push(blogPosts.slice(i * cardsPerView, i * cardsPerView + cardsPerView));
    }
    
    // Add duplicate of first slide at the end
    slides.push(blogPosts.slice(0, cardsPerView));
    
    return slides;
  };

  const slides = createSlides();
  const displayIndex = currentIndex;

  // Auto-rotate carousel every 10 seconds
  useEffect(() => {
    if (isAutoPlaying && !isTransitioning) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= totalSlides + 1) {
            // When reaching duplicate at end, reset to real first slide
            setTimeout(() => {
              setIsTransitioning(true);
              if (trackRef.current) {
                trackRef.current.style.transition = 'none';
                trackRef.current.style.transform = `translateX(-100%)`;
              }
              setTimeout(() => {
                setCurrentIndex(1);
                setIsTransitioning(false);
                if (trackRef.current) {
                  trackRef.current.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                }
              }, 50);
            }, 700);
            return totalSlides + 1;
          }
          return nextIndex;
        });
      }, 10000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isTransitioning, totalSlides]);

  const goToSlide = (index) => {
    setCurrentIndex(index + 1); // +1 because of duplicate at start
    setIsAutoPlaying(false);
    // Resume auto-play after 15 seconds of manual navigation
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToPrevious = () => {
    if (currentIndex <= 1) {
      // Jump to duplicate at end for seamless loop
      setIsTransitioning(true);
      setCurrentIndex(totalSlides + 1);
      setTimeout(() => {
        setIsTransitioning(true);
        if (trackRef.current) {
          trackRef.current.style.transition = 'none';
          trackRef.current.style.transform = `translateX(-${totalSlides * 100}%)`;
        }
        setTimeout(() => {
          setCurrentIndex(totalSlides);
          setIsTransitioning(false);
          if (trackRef.current) {
            trackRef.current.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          }
        }, 50);
      }, 700);
    } else {
      setCurrentIndex(currentIndex - 1);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 15000);
    }
  };

  const goToNext = () => {
    if (currentIndex >= totalSlides) {
      // Jump to duplicate at start for seamless loop
      setIsTransitioning(true);
      setCurrentIndex(0);
      setTimeout(() => {
        setIsTransitioning(true);
        if (trackRef.current) {
          trackRef.current.style.transition = 'none';
          trackRef.current.style.transform = `translateX(0%)`;
        }
        setTimeout(() => {
          setCurrentIndex(1);
          setIsTransitioning(false);
          if (trackRef.current) {
            trackRef.current.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          }
        }, 50);
      }, 700);
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 15000);
    }
  };

  return (
    <section className='blog-section'>
        <div className='blog-container'>
            <h2 className='blog-title'>Our Blogs</h2>
            <p className='blog-subtitle'>
                Our blog is here to help you stay informed about the latest trends,
                designs, and inspirations.
            </p>

            <div className='blog-carousel-wrapper'>
              <button 
                className='carousel-nav-btn carousel-nav-left' 
                onClick={goToPrevious}
                aria-label="Previous slide"
              >
                <FiChevronLeft />
              </button>

              <div className='blog-posts'>
                <div 
                  ref={trackRef}
                  className='blog-posts-track'
                  style={{
                    transform: `translateX(-${displayIndex * 100}%)`
                  }}
                >
                  {slides.map((slidePosts, slideIndex) => (
                    <div key={slideIndex} className='blog-slide'>
                      {slidePosts.map((post, postIndex) => (
                        <div key={`${post.id}-${slideIndex}-${postIndex}`} className='blog-card'>
                          <div className='blog-image-wrapper'>
                            <img src={post.image} alt={post.title} className='blog-image' />
                          </div>
                          <div className='blog-content'>
                            <h3 className='blog-heading'>{post.title}</h3>
                            <p className='blog-excerpt'>{post.excerpt}</p>
                            <Link to='' className='read-more-btn'>
                              Read More
                            </Link>
                            <div className='blog-meta'>
                              <span><FiClock />{post.readTime}</span>
                              <span><FiCalendar />{post.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className='carousel-nav-btn carousel-nav-right' 
                onClick={goToNext}
                aria-label="Next slide"
              >
                <FiChevronRight />
              </button>
            </div>

            {/* Pagination dots */}
            <div className='carousel-pagination'>
              {Array.from({ length: totalSlides }).map((_, index) => {
                const actualIndex = currentIndex > totalSlides ? 0 : currentIndex < 1 ? totalSlides - 1 : currentIndex - 1;
                return (
                  <button
                    key={index}
                    className={`pagination-dot ${index === actualIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                );
              })}
            </div>

            <Link to='' className='blog-btn'>
                <p >View All Posts</p>
            </Link>
        </div>    
    </section>
  )
}

export default BlogSection
