import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-block">
        <div className="hero-image-container">
          <img 
            src="/images/new-york.jpg" 
            alt="East Village New York" 
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-text">
          <p className="hero-subtitle">East Village</p>
          <h2 className="hero-title">New York</h2>
        </div>
      </div>

      <div className="hero-block">
        <div className="hero-image-container">
          <img 
            src="/images/los-angeles.jpg" 
            alt="Koreatown Los Angeles" 
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-text">
          <p className="hero-subtitle">Koreatown</p>
          <h2 className="hero-title">Los Angeles</h2>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
