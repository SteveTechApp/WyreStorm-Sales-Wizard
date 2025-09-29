import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo.tsx';
import ProfileModal from './ProfileModal.tsx';

const Header: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1 text-sm font-mono border-2 uppercase tracking-widest ${isActive ? 'bg-accent text-black border-accent' : 'border-border-color text-accent hover:bg-border-color/50'}`;
  
  return (
    <>
      <header className="bg-background-secondary sticky top-0 z-30 border-b-4 border-border-color print:hidden">
        <div className="container mx-auto flex justify-between items-center p-3">
          <Logo className="text-accent" />
          <nav className="flex items-center gap-2">
              <NavLink to="/" className={navLinkClass} end>FLIGHT DECK</NavLink>
              <NavLink to="/setup" className={navLinkClass}>NEW SORTIE</NavLink>
              <NavLink to="/training" className={navLinkClass}>TRAINING</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="btn btn-primary text-sm"
            >
              PILOT PROFILE
            </button>
          </div>
        </div>
      </header>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};

export default Header;
