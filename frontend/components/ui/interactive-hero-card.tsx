"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function InteractiveHeroCard() {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // const sheenRef = useRef<HTMLDivElement>(null); // Optional: if you want to control sheen dynamically

  useEffect(() => {
    const container = cardContainerRef.current;
    const card = cardRef.current;

    if (!container || !card) return;

    const MAX_ROTATION = 12; // Max degrees of rotation
    const PERSPECTIVE = 1200; // Matches the perspective value in className

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = event.clientX - rect.left - rect.width / 2;
      const mouseY = event.clientY - rect.top - rect.height / 2;

      const rotateY = (mouseX / (rect.width / 2)) * MAX_ROTATION;
      const rotateX = -(mouseY / (rect.height / 2)) * MAX_ROTATION;

      card.style.setProperty('--rotateX', `${rotateX}deg`);
      card.style.setProperty('--rotateY', `${rotateY}deg`);
      card.style.setProperty('--scale', '1.05'); 
      card.style.setProperty('--translateZ', '20px');
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--rotateX', '0deg');
      card.style.setProperty('--rotateY', '0deg');
      card.style.setProperty('--scale', '1');
      card.style.setProperty('--translateZ', '0px');
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Set initial perspective on the card itself if not on parent
    // card.style.transformOrigin = 'center center'; // Ensures rotation is around the center

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardContainerRef}
      id="hero-card-container" 
      className="relative w-full h-80 md:h-96 lg:h-[500px] [perspective:1200px] flex items-center justify-center group"
    >
      <div 
        ref={cardRef}
        id="hero-card" 
        className="relative w-[70%] sm:w-[60%] md:w-[75%] lg:w-[70%] aspect-[3/4] transition-transform duration-150 ease-out transform-style-preserve-3d shadow-xl group-hover:shadow-[0px_0px_30px_5px_rgba(59,130,246,0.3),_-10px_-10px_20px_0px_rgba(255,255,255,0.05)_inset,_10px_10px_20px_0px_rgba(59,130,246,0.1)_inset]"
        style={{
          transform: `rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg)) scale(var(--scale, 1)) translateZ(var(--translateZ, 0px))`,
          transformOrigin: 'center center', // Explicitly set transform origin
        }}
      >
        <div className="absolute inset-0 rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-md">
          <Image
            src="https://miro.medium.com/v2/resize:fit:1400/1*OJK3Wp07WoLO51bTq5J77g.png"
            alt="Hero Product Showcase"
            layout="fill"
            objectFit="cover" 
            priority
            className="opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div 
            id="hero-card-sheen"
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/25 via-white/10 to-transparent opacity-20 transition-opacity duration-500 pointer-events-none group-hover:opacity-30"
            style={{
              transform: 'skewX(var(--sheenSkew, -20deg)) translateX(var(--sheenTranslateX, 0px))',
              // backgroundPosition: 'calc(var(--sheenPosX, 0) * 1%) calc(var(--sheenPosY, 0) * 1%)', 
            }}
          ></div>
          <div className="absolute inset-0 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/20 opacity-50 transition-opacity duration-300 pointer-events-none group-hover:opacity-75"></div>
        </div>
      </div>
    </div>
  );
} 