import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

export const SplashScreen = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if reduced motion is requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fadeOutDelay = prefersReducedMotion ? 1200 : 1850;
    const finishDelay = prefersReducedMotion ? 1500 : 2250;

    // Trigger smooth fade-out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, fadeOutDelay);

    // Complete splash screen and unmount
    const finishTimer = setTimeout(() => {
      sessionStorage.setItem('skillgap_splash_shown', 'true');
      if (onComplete) {
        onComplete();
      }
    }, finishDelay);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`splash-container ${isFadingOut ? 'fading-out' : ''}`}
      role="status"
      aria-label="SkillGap.AI is loading"
      aria-live="polite"
    >
      {/* Ambient Radial AI Glow */}
      <div className="splash-glow-bg" />

      {/* Animated AI Logo with Orbiting Particles */}
      <div className="splash-logo-wrapper">
        <div className="splash-orbit-outer">
          <span className="splash-particle splash-particle-1" />
          <span className="splash-particle splash-particle-2" />
        </div>
        <div className="splash-orbit-inner">
          <span className="splash-particle splash-particle-3" />
          <span className="splash-particle splash-particle-4" />
        </div>

        <div className="splash-central-badge">
          <Compass size={46} strokeWidth={2.2} />
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="splash-title">
        <span className="splash-title-brand">SkillGap</span>
        <span className="splash-title-suffix">.AI</span>
      </h1>

      {/* Tagline */}
      <p className="splash-tagline">
        Discover Your Potential
      </p>

      {/* Subtle Glowing Loading Progress Bar */}
      <div className="splash-progress-track">
        <div className="splash-progress-fill" />
      </div>
    </div>
  );
};

export default SplashScreen;
