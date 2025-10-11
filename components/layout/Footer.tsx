import React from 'react';
import ResolutionSelector from '../ResolutionSelector.tsx';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-secondary border-t border-border-color mt-auto print:hidden flex-shrink-0">
      <div className="container mx-auto p-2 flex justify-between items-center text-xs text-text-secondary">
        <div className="flex-1 text-left">
            <p>&copy; {new Date().getFullYear()} WyreStorm Technologies. AI Wingman is a technology concept.</p>
        </div>
        <div className="flex-1 flex justify-center">
            <ResolutionSelector />
        </div>
        <div className="flex-1"></div>
      </div>
    </footer>
  );
};

export default Footer;