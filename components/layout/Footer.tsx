
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-secondary border-t border-border mt-8 print:hidden">
      <div className="container mx-auto p-4 text-center text-xs text-text-secondary">
        <p>&copy; {new Date().getFullYear()} WyreStorm Technologies. AI Wingman is a technology concept.</p>
      </div>
    </footer>
  );
};

export default Footer;