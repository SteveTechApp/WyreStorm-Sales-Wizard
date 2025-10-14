
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CloseIcon } from './Icons.tsx';
import Logo from './Logo.tsx';
import { useUserContext } from '../context/UserContext.tsx';
import { NAV_LINKS } from '../data/navigation.ts';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ isOpen, onClose }) => {
  const { openProfileModal } = useUserContext();
  
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
  
  const handleOpenProfile = () => {
    onClose();
    openProfileModal();
  };

  const navLinkClass = "block py-3 text-2xl font-bold text-center text-text-primary hover:text-accent transition-colors duration-300";

  return (
    <div 
      className="fixed inset-0 bg-background-secondary z-50 flex flex-col animate-fade-in-fast"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-between items-center p-4 border-b border-border-color">
        <Logo />
        <button onClick={onClose} aria-label="Close menu" className="p-2">
          <CloseIcon className="h-8 w-8 text-text-primary" />
        </button>
      </div>
      <nav className="flex flex-col justify-center items-center flex-grow gap-4 px-4 overflow-y-auto">
        {NAV_LINKS.map((item) => {
          if ('children' in item) {
            return (
              <div key={item.label} className="text-center w-full border-t border-border-color pt-4 mt-4">
                <h3 className="text-sm font-bold uppercase text-text-secondary mb-2">{item.label}</h3>
                <div className="flex flex-col gap-2">
                    {item.children.map(child => (
                        <NavLink key={child.path} to={child.path} className="block py-2 text-xl font-semibold text-center text-text-primary hover:text-accent transition-colors" onClick={onClose}>
                            {child.label}
                        </NavLink>
                    ))}
                </div>
              </div>
            );
          }
          return (
            <NavLink key={item.path} to={item.path} className={navLinkClass} onClick={onClose} end={item.end}>
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-6 border-t border-border-color flex flex-col items-center gap-4">
        <button
          onClick={handleOpenProfile}
          className="btn btn-primary w-full max-w-xs"
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default MobileNavMenu;