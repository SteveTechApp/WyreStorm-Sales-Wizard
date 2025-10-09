import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CloseIcon } from './Icons.tsx';
import Logo from './Logo.tsx';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinkClass = "block py-4 text-2xl font-bold text-center text-text-primary hover:text-accent transition-colors duration-300";

  return (
    <div 
      className="fixed inset-0 bg-background-secondary z-50 flex flex-col animate-fade-in-fast"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-between items-center p-4 border-b border-border">
        <Logo />
        <button onClick={onClose} aria-label="Close menu" className="p-2">
          <CloseIcon className="h-8 w-8 text-text-primary" />
        </button>
      </div>
      <nav className="flex flex-col justify-center items-center flex-grow gap-6">
        <NavLink to="/" className={navLinkClass} onClick={onClose} end>Dashboard</NavLink>
        <NavLink to="/setup" className={navLinkClass} onClick={onClose}>New Project</NavLink>
        <NavLink to="/video-generator" className={navLinkClass} onClick={onClose}>Video Gen</NavLink>
        <NavLink to="/training" className={navLinkClass} onClick={onClose}>Training</NavLink>
      </nav>
    </div>
  );
};

export default MobileNavMenu;