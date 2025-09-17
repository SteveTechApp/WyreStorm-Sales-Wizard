import React from 'react';
import { SparklesIcon } from './Icons';

interface QuickQuestionFABProps {
  onClick: () => void;
}

const QuickQuestionFAB: React.FC<QuickQuestionFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-accent hover:bg-accent-hover text-text-on-accent rounded-full p-4 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent z-40"
      aria-label="Ask a quick question"
    >
      <SparklesIcon className="h-8 w-8" />
    </button>
  );
};

export default QuickQuestionFAB;