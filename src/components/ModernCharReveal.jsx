import React from 'react';
import ScrollReveal from './ui/ScrollReavel/ScrollReveal';

const ModernCharReveal = () => {
  return (
    <section className="char-reveal-section bg-gradient-to-b to-[#060010] from-[#020E22]" data-scroll>
      <div className="char-reveal-inner">
        <ScrollReveal
          className="char-reveal-heading"
          enableBlur={true}
          baseOpacity={0}
          baseRotation={5}
          blurStrength={10}
        >
          ApexUI Special Effects for Modern Web — Smooth, Animated, and Interactive UI Components for Creators
        </ScrollReveal>
      </div>
      {/* Stylish SVG Background (abstract, blurred, modern) */}
      <div
        className="stylish-bg-svg"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "relative", left: 0, top: 0, width: "100%", height: "100%", padding: "0 2vw" }}
        >
          <ellipse cx="300" cy="220" rx="300" ry="120" fill="#a855f7" opacity="0.10" />
          <ellipse cx="1200" cy="100" rx="230" ry="100" fill="#3b82f6" opacity="0.10" />
          <ellipse cx="800" cy="300" rx="300" ry="80" fill="#ec4899" opacity="0.08" />
          <ellipse cx="900" cy="60" rx="120" ry="60" fill="#fff" opacity="0.04" />
          <ellipse cx="400" cy="60" rx="120" ry="60" fill="#fff" opacity="0.04" />
        </svg>
      </div>
    </section>
  );
};

export default ModernCharReveal;
