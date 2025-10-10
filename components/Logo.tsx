import React from 'react';
import { Link } from 'react-router-dom';

// Base64 encoded WyreStorm logo
const wyrestormLogoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAyCAYAAAD2d2CEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAdASURBVHhe7dxRjiNHEMTxWJ/tL/bB3hZ7sAf7I0xWEA0IBIggSNwk8gL5/7k/pXlVVVvVvP2X3Nzc3Nz8d3R0fP369atXr169evXq1atXr169evXq9etvbG5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7+3zQ2Nj4/P29tbX1+fn5+fn5+fn7+/Pz8+Ph4Y2Pj/v37jx49evTo0aNHjx49evTo0aNHjx49evTo0aPHjyMvX77c2tr66dOnhw8fPn78+PHjx48fP378+PHjx48fP378+PHjx48fP378+PHzs/f29j5+/HhhYeH79+/fvn379u3bt2/fvn379u3bt2/fvn379u3bN3Jz86f/2P4dDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className || ''}`}>
      <img src={wyrestormLogoSrc} alt="WyreStorm Logo" className="h-8 object-contain" />
      <span className="font-bold text-xl uppercase tracking-widest text-text-primary">WINGMAN</span>
    </Link>
  );
};

export default Logo;
