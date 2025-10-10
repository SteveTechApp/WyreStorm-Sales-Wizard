
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo.tsx';
import ThemeSelector from '../ThemeSelector.tsx';
import { useUserContext } from '../../context/UserContext.tsx';
import { HamburgerIcon } from '../Icons.tsx';
import MobileNavMenu from '../MobileNavMenu.tsx';

const DefaultHeader: React.FC = () => {
  const { openProfileModal } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 px-3 rounded-md text-sm font-medium ${isActive ? 'bg-background text-text-primary' : 'text-text-secondary hover:bg-background-secondary/50 hover:text-text-primary'}`;

  return (
    <>
      <header className="bg-background-secondary sticky top-0 z-30 border-b border-border print:hidden">
        <div className="container mx-auto flex justify-between items-center p-3">
          <Logo />
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>Dashboard</NavLink>
            <NavLink to="/setup" className={navLinkClass}>New Project</NavLink>
            <NavLink to="/video-generator" className={navLinkClass}>Video Gen</NavLink>
            <NavLink to="/training" className={navLinkClass}>Training</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ThemeSelector />
              <button
                onClick={openProfileModal}
                className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md text-sm"
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