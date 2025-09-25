import React from 'react';
import { getPastelColorFromString } from '../utils/utils';

interface ImagePlaceholderProps {
  text: string; // Text to generate color from and display initials
  className?: string;
  textClassName?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ text, className = 'w-full h-full', textClassName = 'text-xl' }) => {
  // FIX: Add a guard to prevent TypeError on null/undefined text
  const safeText = text || '?';
  
  const bgColor = getPastelColorFromString(safeText);
  const initials = safeText
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`${className} ${bgColor} flex items-center justify-center`}>
      <span className={`${textClassName} font-bold text-gray-600 opacity-70 select-none`}>{initials}</span>
    </div>
  );
};

export default ImagePlaceholder;