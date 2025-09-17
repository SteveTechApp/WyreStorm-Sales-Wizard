import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3" aria-label="WyreStorm Wingman Logo">
      <svg width="32" height="32" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="text-accent flex-shrink-0">
        <path
          fill="currentColor"
          d="M20 2.5L37.5 20L20 37.5L12.5 30L22.5 20L12.5 10L20 2.5Z"
        />
        <path
          fill="currentColor"
          opacity="0.6"
          d="M2.5 20L12.5 30L20 22.5L10 12.5L2.5 20Z"
        />
      </svg>
      <div 
        className="text-2xl tracking-normal font-display"
      >
        <span className="font-bold text-accent">WyreStorm</span>
        <span className="font-medium text-text-primary ml-2">Wingman</span>
      </div>
    </div>
  );
};

export default Logo;