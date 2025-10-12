import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo.tsx';
import { useUserContext } from '../../context/UserContext.tsx';
import { HamburgerIcon } from '../Icons.tsx';
import MobileNavMenu from '../MobileNavMenu.tsx';
import { NavLinkItem } from '../../data/navigation.ts';

interface DefaultHeaderProps {
  links: NavLinkItem[];
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ links }) => {
  const { openProfileModal } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 px-3 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-accent font-bold' : 'text-text-secondary hover:text-text-primary'}`;

  return (
    <>
      <header className="sticky top-0 z-30 bg-background border-b border-border-color print:hidden shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-3">
          <Logo />
          <nav className="hidden md:flex items-center gap-4">
            {links.map(link => (
              <NavLink key={link.path} to={link.path} className={navLinkClass} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={openProfileModal}
                className="btn btn-secondary text-sm px-4 py-2"
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
      <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} links={links} />
    </>
  );
};

export default DefaultHeader;
