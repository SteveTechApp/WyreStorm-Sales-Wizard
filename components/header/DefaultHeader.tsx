import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo.tsx';
import ProfileModal from '../ProfileModal.tsx';
import ThemeSelector from '../ThemeSelector.tsx';

const DefaultHeader: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 px-3 rounded-md text-sm font-medium ${isActive ? 'bg-background text-text-primary' : 'text-text-secondary hover:bg-background-secondary/50 hover:text-text-primary'}`;

  return (
    <>
      <header className="bg-background-secondary/80 backdrop-blur-sm sticky top-0 z-30 border-b border-border print:hidden">
        <div className="container mx-auto flex justify-between items-center p-3">
          <Logo />
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>Dashboard</NavLink>
            <NavLink to="/setup" className={navLinkClass}>New Project</NavLink>
            <NavLink to="/training" className={navLinkClass}>Training</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md text-sm"
            >
              Profile
            </button>
          </div>
        </div>
      </header>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};

export default DefaultHeader;