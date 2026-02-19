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
        excerpt: "Discover how modern furniture design embraces millennial aesthetics with clean lines, minimalist approaches, and sustainable materials that resonate with today's generation.",
        image: Blog1,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 2,
        title: "Sustainable furniture for modern homes",
        excerpt: "Explore eco-friendly furniture options that combine style with sustainability, helping you create beautiful spaces while caring for the environment.",
        image:Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 3,
        title: "Maximizing small spaces with smart design",
        excerpt: "Learn innovative furniture solutions and design tips to make the most of compact living spaces without compromising on style or functionality.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 4,
        title: "The art of mixing vintage and modern",
        excerpt: "Master the technique of blending vintage pieces with contemporary furniture to create unique, timeless interiors that tell your personal story.",
        image:Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 5,
        title: "Color trends in furniture design 2024",
        excerpt: "Stay ahead with the latest color palettes and trends shaping furniture design this year, from bold statements to subtle elegance.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 6,
        title: "Creating cozy corners in your home",
        excerpt: "Transform unused spaces into inviting nooks with the right furniture choices, lighting, and accessories for ultimate comfort and relaxation.",
        image:Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 7,
        title: "Investment pieces that last a lifetime",
        excerpt: "Discover which furniture pieces are worth the investment, offering durability, timeless design, and value that grows over the years.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 8,
        title: "Home office furniture essentials",
        excerpt: "Design a productive workspace with ergonomic furniture solutions that balance comfort, functionality, and style for the modern remote worker.",
        image:Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 9,
        title: "Outdoor furniture for all seasons",
        excerpt: "Choose durable outdoor furniture that withstands weather while maintaining elegance, creating perfect spaces for relaxation and entertainment.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 10,
        title: "Minimalist design principles",
        excerpt: "Embrace the beauty of less with minimalist furniture design that focuses on quality, functionality, and clean aesthetics for serene living spaces.",
        image:Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 11,
        title: "Smart storage solutions",
        excerpt: "Maximize your home's potential with innovative furniture that doubles as storage, keeping your space organized and clutter-free.",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 12,
        title: "Luxury furniture on a budget",
        excerpt: "Achieve high-end looks without breaking the bank with strategic furniture choices and styling tips that create luxury on any budget.",
        image:Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
               
];

const BlogSection = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 because we duplicate first slide
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const intervalRef = useRef(null);
  const trackRef = useRef(null);
  const cardsPerView = 2;
  const totalSlides = Math.ceil(blogPosts.length / cardsPerView);
  
  // Create slides array with duplicates for infinite loop
  const createSlides = () => {
    const slides = [];
    // Add last slide at the beginning
    slides.push(blogPosts.slice(-cardsPerView));
    // Add all slides
    for (let i = 0; i < totalSlides; i++) {
      slides.push(blogPosts.slice(i * cardsPerView, i * cardsPerView + cardsPerView));
    }
    // Add first slide at the end
    slides.push(blogPosts.slice(0, cardsPerView));
    return slides;
  };

  const slides = createSlides();
  const totalSlidesWithDupes = slides.length;

  // Auto-rotate carousel every 10 seconds
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // If we've reached the last duplicate slide, instantly jump to the real first slide
          if (nextIndex >= totalSlidesWithDupes - 1) {
            setTimeout(() => {
              setIsTransitioning(false);
              setCurrentIndex(1);
              setTimeout(() => setIsTransitioning(true), 10);
            }, 600);
            return nextIndex;
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
  }, [isAutoPlaying, totalSlidesWithDupes]);

  const goToSlide = (index, skipTransition = false) => {
    if (skipTransition) {
      setIsTransitioning(false);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(true), 50);
    } else {
      setCurrentIndex(index);
    }
    setIsAutoPlaying(false);
    // Resume auto-play after 15 seconds of manual navigation
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex < 1) {
      // Smoothly go to duplicate first slide (index 0), then instantly jump to real last
      goToSlide(0);
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalSlidesWithDupes - 2);
        setTimeout(() => setIsTransitioning(true), 10);
      }, 600);
    } else {
      goToSlide(prevIndex);
    }
  };

  const goToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalSlidesWithDupes - 1) {
      // Smoothly go to the duplicate last slide, then instantly jump to real first
      goToSlide(totalSlidesWithDupes - 1);
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
        setTimeout(() => setIsTransitioning(true), 10);
      }, 600);
    } else {
      goToSlide(nextIndex);
    }
  };

  const handleDotClick = (dotIndex) => {
    // dotIndex is 0-based for the real slides, but we start at index 1
    goToSlide(dotIndex + 1);
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
                  className={`blog-posts-track ${!isTransitioning ? 'no-transition' : ''}`}
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`
                  }}
                >
                  {slides.map((slidePosts, slideIndex) => (
                    <div key={slideIndex} className='blog-slide'>
                      {slidePosts.map((post) => (
                        <div key={`${post.id}-${slideIndex}`} className='blog-card'>
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
                // Calculate the real slide index (accounting for duplicates at start and end)
                let realIndex;
                if (currentIndex === 0) {
                  // At duplicate last slide, show last real slide
                  realIndex = totalSlides - 1;
                } else if (currentIndex >= totalSlidesWithDupes - 1) {
                  // At duplicate first slide, show first real slide
                  realIndex = 0;
                } else {
                  // Normal case: real slides are indices 1 through totalSlides
                  realIndex = currentIndex - 1;
                }
                return (
                  <button
                    key={index}
                    className={`pagination-dot ${index === realIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
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
