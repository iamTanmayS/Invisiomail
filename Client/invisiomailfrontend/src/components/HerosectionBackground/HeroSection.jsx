import React from 'react';
import '../../Styles/HeroSectionBackground.css';

function HeroSection({ children }) {
  return (
    <div className="hero-section-background">
      {/* Background elements */}
      <div className="background-elements">
        {/* Noise overlay */}
        <div className="noise-overlay"></div>
        
        {/* Sparkles/Stars Background */}
        <div className="sparkles-container">
          {Array.from({ length: 50 }).map((_, index) => {
            // Random positions
            const top = `${Math.random() * 100}%`;
            const left = `${Math.random() * 100}%`;
            // Random size between 2px and 6px
            const size = `${2 + Math.random() * 4}px`;
            // Random gradient class
            const gradientClass = `sparkle-gradient-${Math.floor(Math.random() * 5) + 1}`;
            // Random opacity
            const opacity = 0.1 + Math.random() * 0.7;
            // Random delay for animation
            const animationDelay = `${Math.random() * 5}s`;
            
            return (
              <div
                key={index}
                className={`sparkle ${gradientClass}`}
                style={{
                  top,
                  left,
                  width: size,
                  height: size,
                  opacity,
                  animationDelay,
                }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Content */}
      <div className="hero-section-content">
        {children}
      </div>
    </div>
  );
}

export default HeroSection;