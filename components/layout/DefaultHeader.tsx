import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo.tsx';
import { useUserContext } from '../../context/UserContext.tsx';
import { HamburgerIcon } from '../Icons.tsx';
import MobileNavMenu from '../MobileNavMenu.tsx';

const DefaultHeader: React.FC = () => {
  const { openProfileModal } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 px-3 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-background/80 text-accent font-bold' : 'text-text-secondary hover:bg-background/50 hover:text-text-primary'}`;

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-lg border-b border-border-color/50 print:hidden">
        <div className="container mx-auto flex justify-between items-center p-3">
          <Logo />
          <nav className="hidden md:flex items-center gap-2 bg-background-secondary/50 border border-border-color/50 rounded-full p-1">
            <NavLink to="/" className={navLinkClass} end>Dashboard</NavLink>
            <NavLink to="/setup" className={navLinkClass}>New Project</NavLink>
            <NavLink to="/training" className={navLinkClass}>Training</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={openProfileModal}
                className="bg-accent/10 hover:bg-accent/20 text-accent font-bold py-2 px-4 rounded-full text-sm border-2 border-accent/20"
              >
                Profile
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md hover:bg-border-color"
                aria-label="Open navigation menu"
              >
                <HamburgerIcon className="h-6 w-6 text-text-primary" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default DefaultHeader;