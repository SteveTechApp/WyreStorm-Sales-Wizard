import React, { useState } from 'react';
import Logo from './Logo.tsx';
import ThemeSelector from './ThemeSelector.tsx';
import { HamburgerIcon } from './Icons.tsx';
import MobileNavMenu from './MobileNavMenu.tsx';

interface HeaderProps {
  onOpenProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-background-secondary sticky top-0 z-30 border-b border-border print:hidden">
        <div className="container mx-auto flex justify-between items-center p-3">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <button
              onClick={onOpenProfile}
              className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md text-sm"
            >
              Profile
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-md hover:bg-border-color"
              aria-label="Open navigation menu"
            >
              <HamburgerIcon className="h-6 w-6 text-text-primary" />
            </button>
          </div>
        </div>
      </header>
      <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;