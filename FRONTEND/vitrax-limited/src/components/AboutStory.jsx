import React from 'react';
import { FaLightbulb, FaRocket, FaTrophy, FaHeart } from 'react-icons/fa';
import './AboutStory.css';

const AboutStory = () => {
  const milestones = [
    {
      year: "2008",
      title: "The Beginning",
      description: "Founded with a vision to transform living spaces with innovative furniture designs.",
      icon: FaLightbulb,
      color: "#fbbf24"
    },
    {
      year: "2013",
      title: "Expansion",
      description: "Expanded operations across East Africa, establishing showrooms in major cities.",
      icon: FaRocket,
      color: "#10b981"
    },
    {
      year: "2018",
      title: "Excellence",
      description: "Received multiple industry awards for design innovation and customer service.",
      icon: FaTrophy,
      color: "#3b82f6"
    },
    {
      year: "2023",
      title: "Innovation",
      description: "Launched sustainable furniture line and digital showroom experience.",
      icon: FaHeart,
      color: "#ec4899"
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We constantly push boundaries to create unique, functional designs that inspire.",
      icon: "💡",
      color: "#fbbf24"
    },
    {
      title: "Quality",
      description: "Every piece is crafted with premium materials and attention to detail.",
      icon: "⭐",
      color: "#10b981"
    },
    {
      title: "Sustainability",
      description: "Committed to eco-friendly practices and responsible sourcing.",
      icon: "🌱",
      color: "#3b82f6"
    },
    {
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond to exceed expectations.",
      icon: "❤️",
      color: "#ec4899"
    }
  ];

  return (
    <div className="about-story">
      <div className="story-container">
        {/* Mission & Vision Section */}
        <div className="mission-vision">
          <div className="mission-card">
            <div className="card-header">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
            </div>
            <p>
              To create beautiful, functional, and sustainable furniture that transforms 
              living spaces and enhances the quality of life for our customers. We strive 
              to be the leading furniture company in East Africa, known for innovation, 
              quality, and exceptional customer service.
            </p>
          </div>

          <div className="vision-card">
            <div className="card-header">
              <div className="card-icon">🔮</div>
              <h3>Our Vision</h3>
            </div>
            <p>
              To be the most trusted and innovative furniture brand in Africa, 
              setting industry standards for design excellence, sustainability, 
              and customer experience. We envision a future where every home 
              reflects the perfect blend of style, comfort, and functionality.
            </p>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="journey-section">
          <div className="section-header">
            <h2>Our Journey</h2>
            <p>15+ years of innovation, growth, and excellence in furniture design</p>
          </div>

          <div className="timeline">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              return (
                <div key={index} className="timeline-item" style={{ '--milestone-color': milestone.color }}>
                  <div className="timeline-marker">
                    <div className="marker-icon">
                      <IconComponent />
                    </div>
                    <div className="marker-line"></div>
                  </div>
                  
                  <div className="timeline-content">
                    <div className="timeline-year">{milestone.year}</div>
                    <h4 className="timeline-title">{milestone.title}</h4>
                    <p className="timeline-description">{milestone.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="values-section">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card" style={{ '--value-color': value.color }}>
                <div className="value-icon">{value.icon}</div>
                <h4 className="value-title">{value.title}</h4>
                <p className="value-description">{value.description}</p>
                <div className="value-glow"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>Passionate professionals dedicated to creating exceptional furniture</p>
          </div>

          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">
                <div className="avatar-placeholder">
                  <div className="avatar-glow"></div>
                </div>
              </div>
              <div className="team-info">
                <h4>Sarah Mwangi</h4>
                <p className="team-role">Founder & CEO</p>
                <p className="team-bio">
                  Visionary leader with 20+ years in furniture design and business management.
                </p>
              </div>
            </div>

            <div className="team-card">
              <div className="team-avatar">
                <div className="avatar-placeholder">
                  <div className="avatar-glow"></div>
                </div>
              </div>
              <div className="team-info">
                <h4>David Ochieng</h4>
                <p className="team-role">Head of Design</p>
                <p className="team-bio">
                  Award-winning designer with expertise in modern African aesthetics.
                </p>
              </div>
            </div>

            <div className="team-card">
              <div className="team-avatar">
                <div className="avatar-placeholder">
                  <div className="avatar-glow"></div>
                </div>
              </div>
              <div className="team-info">
                <h4>Grace Wanjiku</h4>
                <p className="team-role">Operations Manager</p>
                <p className="team-bio">
                  Ensures seamless operations and exceptional customer experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutStory;
