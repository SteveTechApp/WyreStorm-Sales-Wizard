
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavLinkItem } from '../../data/navigation.ts';
import { ChevronDownIcon } from '../Icons.tsx';

interface NavDropdownProps {
  label: string;
  children: NavLinkItem[];
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, children }) => {
  return (
    <div className="relative group">
      <button className="py-2 px-3 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors">
        <span>{label}</span>
        <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-background rounded-xl shadow-lg border border-border-color p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-40">
        <div className="space-y-1">
          {children.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block p-3 rounded-lg hover:bg-background-secondary ${isActive ? 'bg-background-secondary' : ''}`
              }
            >
              <div className="flex items-start gap-3">
                <div className="text-accent mt-1 flex-shrink-0">
                  {React.cloneElement(item.icon as React.ReactElement, { className: "h-6 w-6" })}
                </div>
                <div>
                    <p className="font-semibold text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-secondary">{item.description}</p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavDropdown;