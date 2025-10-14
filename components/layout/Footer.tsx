import React from 'react';
import ResolutionSelector from '../ResolutionSelector.tsx';
import { ChatBubbleIcon } from '../icons/UIIcons.tsx';

interface FooterProps {
  onFeedbackClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onFeedbackClick }) => {
  return (
    <footer className="bg-background-secondary border-t border-border-color mt-auto print:hidden flex-shrink-0">
      <div className="container mx-auto p-2 flex justify-between items-center text-xs text-text-secondary">
        <div className="flex-1 text-left">
            <p>&copy; {new Date().getFullYear()} WyreStorm Technologies. AI Wingman is a technology concept.</p>
        </div>
        <div className="flex-1 flex justify-center">
            <ResolutionSelector />
        </div>
        <div className="flex-1 text-right">
            <button onClick={onFeedbackClick} className="flex items-center gap-1.5 font-medium hover:text-accent hover:underline ml-auto">
                <ChatBubbleIcon className="h-4 w-4" />
                Submit Feedback
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
