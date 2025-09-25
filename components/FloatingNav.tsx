import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';

interface FloatingNavProps {
  children: React.ReactNode;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ children }) => {
  const { theme } = useAppContext();

  if (theme === 'cockpit') {
    return (
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-slate-800 p-1 rounded-md shadow-lg border-2 border-t-slate-600 border-l-slate-600 border-b-slate-950 border-r-slate-950 z-40 font-mono">
          <div className="flex items-center gap-1">
              {children}
          </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-background-secondary/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-border-color z-40">
        <div className="flex items-center gap-2">
            {children}
        </div>
    </div>
  );
};

export default FloatingNav;