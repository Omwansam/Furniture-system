import React from 'react';
import { 
  FaInstagram, 
  FaFacebook, 
  FaYoutube, 
  FaTwitter, 
  FaWhatsapp,
  FaUsers,
  FaVideo,
  FaComment,
  FaShare
} from 'react-icons/fa';
import './ContactSocialMedia.css';

const ContactSocialMedia = ({ socialMedia }) => {
  const platforms = [
    {
      name: 'Instagram',
      icon: FaInstagram,
      color: '#E4405F',
      gradient: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
      data: socialMedia?.instagram,
      url: socialMedia?.instagram?.url || 'https://instagram.com/vitrax_kenya'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: '#1877F2',
      gradient: 'linear-gradient(135deg, #1877F2, #42A5F5)',
      data: socialMedia?.facebook,
      url: socialMedia?.facebook?.url || 'https://facebook.com/vitraxkenya'
    },
    {
      name: 'YouTube',
      icon: FaYoutube,
      color: '#FF0000',
      gradient: 'linear-gradient(135deg, #FF0000, #FF6B6B)',
      data: socialMedia?.youtube,
      url: socialMedia?.youtube?.url || 'https://youtube.com/@vitraxkenya'
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: '#1DA1F2',
      gradient: 'linear-gradient(135deg, #1DA1F2, #64B5F6)',
      data: socialMedia?.twitter,
      url: socialMedia?.twitter?.url || 'https://twitter.com/vitrax_kenya'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: '#25D366',
      gradient: 'linear-gradient(135deg, #25D366, #4CAF50)',
      data: socialMedia?.whatsapp,
      url: socialMedia?.whatsapp?.url || 'https://wa.me/254700123456'
    }
  ];

  const handleSocialClick = (platform, url) => {
    // Track social media clicks
    console.log(`Clicked on ${platform} - ${url}`);
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getMetricIcon = (platform) => {
    switch (platform) {
      case 'Instagram':
      case 'Facebook':
      case 'Twitter':
        return <FaUsers />;
      case 'YouTube':
        return <FaVideo />;
      case 'WhatsApp':
        return <FaComment />;
      default:
        return <FaShare />;
    }
  };

  const getMetricLabel = (platform) => {
    switch (platform) {
      case 'Instagram':
      case 'Facebook':
      case 'Twitter':
        return 'Followers';
      case 'YouTube':
        return 'Subscribers';
      case 'WhatsApp':
        return 'Status';
      default:
        return 'Engagement';
    }
  };

  const getMetricValue = (platform, data) => {
    switch (platform) {
      case 'Instagram':
        return data?.followers || '2.5K';
      case 'Facebook':
        return data?.followers || '5.2K';
      case 'YouTube':
        return data?.subscribers || '1.8K';
      case 'Twitter':
        return data?.followers || '3.1K';
      case 'WhatsApp':
        return data?.status || 'Available';
      default:
        return 'Active';
    }
  };

  return (
    <div className="contact-social-media">
      <div className="social-header">
        <h3>Connect With Us</h3>
        <p>Follow us on social media for the latest updates, product launches, and exclusive offers</p>
      </div>

      <div className="social-grid">
        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <div 
              key={platform.name}
              className="social-card"
              onClick={() => handleSocialClick(platform.name, platform.url)}
              style={{ '--platform-color': platform.color }}
            >
              <div className="social-card-header">
                <div 
                  className="platform-icon"
                  style={{ background: platform.gradient }}
                >
                  <IconComponent />
                </div>
                <div className="platform-info">
                  <h4>{platform.name}</h4>
                  <p>{platform.data?.handle || `@vitrax_kenya`}</p>
                </div>
              </div>

              <div className="social-metrics">
                <div className="metric">
                  <div className="metric-icon">
                    {getMetricIcon(platform.name)}
                  </div>
                  <div className="metric-content">
                    <span className="metric-label">{getMetricLabel(platform.name)}</span>
                    <span className="metric-value">{getMetricValue(platform.name, platform.data)}</span>
                  </div>
                </div>
              </div>

              <div className="social-actions">
                <button className="follow-btn">
                  {platform.name === 'WhatsApp' ? 'Message Us' : 'Follow'}
                </button>
              </div>

              <div className="social-card-bg" style={{ background: platform.gradient }}></div>
            </div>
          );
        })}
      </div>

      <div className="social-highlights">
        <div className="highlight-card">
          <div className="highlight-icon">
            <FaUsers />
          </div>
          <div className="highlight-content">
            <h4>Community</h4>
            <p>Join our growing community of furniture enthusiasts</p>
          </div>
        </div>

        <div className="highlight-card">
          <div className="highlight-icon">
            <FaVideo />
          </div>
          <div className="highlight-content">
            <h4>Content</h4>
            <p>Exclusive behind-the-scenes and product showcases</p>
          </div>
        </div>

        <div className="highlight-card">
          <div className="highlight-icon">
            <FaComment />
          </div>
          <div className="highlight-content">
            <h4>Support</h4>
            <p>Get instant help and answers to your questions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSocialMedia;
