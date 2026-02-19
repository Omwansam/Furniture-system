import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiHeart, FiMessageCircle, FiExternalLink, FiUsers, FiImage } from 'react-icons/fi';
import { socialMediaService } from '../socialMediaService';
import './SocialsSection.css';

const SocialsSection = () => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchSocialData();
  }, []);

  const fetchSocialData = async () => {
    try {
      setLoading(true);
      const [postsData, statsData] = await Promise.all([
        socialMediaService.getPosts('instagram', 6),
        socialMediaService.getStats('instagram')
      ]);
      
      setPosts(postsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching social data:', err);
      setError('Failed to load social media content');
      // Set fallback data
      setPosts(getFallbackPosts());
      setStats(getFallbackStats());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPosts = () => [
    {
      post_id: 1,
      image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      caption: 'Modern living room setup with our premium furniture collection',
      likes_count: 1247,
      comments_count: 89,
      post_url: 'https://instagram.com'
    },
    {
      post_id: 2,
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      caption: 'Cozy bedroom design featuring our latest arrivals',
      likes_count: 892,
      comments_count: 56,
      post_url: 'https://instagram.com'
    },
    {
      post_id: 3,
      image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
      caption: 'Dining room elegance with our signature pieces',
      likes_count: 1567,
      comments_count: 123,
      post_url: 'https://instagram.com'
    },
    {
      post_id: 4,
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      caption: 'Office space transformation with ergonomic furniture',
      likes_count: 743,
      comments_count: 45,
      post_url: 'https://instagram.com'
    },
    {
      post_id: 5,
      image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      caption: 'Outdoor furniture collection for your patio',
      likes_count: 1023,
      comments_count: 78,
      post_url: 'https://instagram.com'
    },
    {
      post_id: 6,
      image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
      caption: 'Kitchen island design with bar stools',
      likes_count: 1345,
      comments_count: 92,
      post_url: 'https://instagram.com'
    }
  ];

  const getFallbackStats = () => ({
    followers_count: 15420,
    posts_count: 342,
    engagement_rate: 4.8
  });

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(posts.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(posts.length / 3)) % Math.ceil(posts.length / 3));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentPosts = posts.slice(currentSlide * 3, (currentSlide * 3) + 3);
  const totalSlides = Math.ceil(posts.length / 3);

  if (loading) {
    return (
      <section className='socials-section'>
        <div className='socials-container'>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading Instagram feed...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='socials-section'>
      <div className="socials-background-pattern"></div>
      
      <div className='socials-container'>
        {/* Header Section */}
        <div className="socials-header">
          <div className="socials-title-section">
            <div className="instagram-icon">
              <FiInstagram />
            </div>
            <h2 className='socials-title'>Our Instagram</h2>
            <p className='socials-subtitle'>Follow our Store on Instagram</p>
          </div>

          {/* Stats Section */}
          {stats && (
            <div className="socials-stats">
              <div className="stat-item">
                <FiUsers className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{formatNumber(stats.followers_count)}</span>
                  <span className="stat-label">Followers</span>
                </div>
              </div>
              <div className="stat-item">
                <FiImage className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{formatNumber(stats.posts_count)}</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>
              <div className="stat-item">
                <FiHeart className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{stats.engagement_rate}%</span>
                  <span className="stat-label">Engagement</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instagram Feed Grid */}
        <div className="instagram-feed">
          <div className="feed-header">
            <h3>Latest Posts</h3>
            <div className="feed-controls">
              <button 
                className="nav-btn prev-btn" 
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                ‹
              </button>
              <button 
                className="nav-btn next-btn" 
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
              >
                ›
              </button>
            </div>
          </div>

          <div className="posts-grid">
            {currentPosts.map((post, index) => (
              <div key={post.post_id} className="post-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="post-image-container">
                  <img 
                    src={post.image_url} 
                    alt={post.caption || 'Instagram post'} 
                    className="post-image"
                    loading="lazy"
                  />
                  <div className="post-overlay">
                    <div className="post-stats">
                      <div className="stat">
                        <FiHeart />
                        <span>{formatNumber(post.likes_count)}</span>
                      </div>
                      <div className="stat">
                        <FiMessageCircle />
                        <span>{formatNumber(post.comments_count)}</span>
                      </div>
                    </div>
                    <a 
                      href={post.post_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-post-btn"
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                </div>
                <div className="post-caption">
                  <p>{post.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="slide-indicators">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="socials-cta">
          <Link to='https://instagram.com' target="_blank" className='socials-btn'>
            <FiInstagram />
            <span>Follow Us on Instagram</span>
          </Link>
          <p className="cta-subtitle">Get inspired with our latest furniture designs and home decor tips</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchSocialData} className="retry-btn">Try Again</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialsSection;
