
import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo.tsx';

const CockpitHeader: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1 text-sm font-mono border-2 uppercase tracking-widest ${isActive ? 'bg-accent text-black border-accent' : 'border-border text-accent hover:bg-border/50'}`;
  
  return (
    <header className="bg-background-secondary sticky top-0 z-30 border-b-4 border-border print:hidden">
      <div className="container mx-auto flex justify-between items-center p-3">
        <Logo className="text-accent" />
        <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>FLIGHT DECK</NavLink>
            <NavLink to="/setup" className={navLinkClass}>NEW SORTIE</NavLink>
            <NavLink to="/video-generator" className={navLinkClass}>VIDEO GEN</NavLink>
            <NavLink to="/training" className={navLinkClass}>TRAINING</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default CockpitHeader;