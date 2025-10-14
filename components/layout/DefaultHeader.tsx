
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo.tsx';
import { useUserContext } from '../../context/UserContext.tsx';
import { HamburgerIcon } from '../Icons.tsx';
import MobileNavMenu from '../MobileNavMenu.tsx';
import { NAV_LINKS } from '../../data/navigation.ts';
import Search from '../Search.tsx';
import NavDropdown from './NavDropdown.tsx';

const DefaultHeader: React.FC = () => {
  const { openProfileModal } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 px-3 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-accent font-bold' : 'text-text-secondary hover:text-text-primary'}`;

  return (
    <>
      <header className="sticky top-0 z-30 bg-background border-b border-border-color print:hidden shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-3">
          <Logo />
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map(item => {
              if ('children' in item) {
                return <NavDropdown key={item.label} label={item.label} children={item.children} />;
              }
              return (
                <NavLink key={item.path} to={item.path} className={navLinkClass} end={item.end}>
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="flex items-center gap-4">
            <Search />
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
      <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default DefaultHeader;