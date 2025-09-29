import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo.tsx';

const CockpitHeader: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1 text-sm font-mono border-2 ${isActive ? 'bg-amber-500 text-black border-amber-500' : 'border-slate-700 text-amber-500 hover:bg-slate-800'}`;
  
  return (
    <header className="bg-slate-900 sticky top-0 z-30 border-b-4 border-slate-700 print:hidden">
      <div className="container mx-auto flex justify-between items-center p-3">
        <Logo className="text-amber-500" />
        <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>DASHBOARD</NavLink>
            <NavLink to="/setup" className={navLinkClass}>NEW_PROJECT</NavLink>
            <NavLink to="/training" className={navLinkClass}>TRAINING</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default CockpitHeader;
