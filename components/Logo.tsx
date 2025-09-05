import React from 'react';

interface LogoProps {
  variant?: 'color' | 'white';
}

const Logo: React.FC<LogoProps> = ({ variant = 'color' }) => {
  // Use brand colors for the text
  const textColor = variant === 'white' ? 'text-white' : 'text-[#D71A21]'; // Official WyreStorm Red

  return (
    <div 
      className={`font-extrabold text-2xl tracking-tight ${textColor}`}
      aria-label="WyreStorm Logo"
    >
      WyreStorm
    </div>
  );
};

export default Logo;
