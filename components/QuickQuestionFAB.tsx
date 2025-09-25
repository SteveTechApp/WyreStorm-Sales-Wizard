import React from 'react';
import { SparklesIcon } from './Icons';

interface QuickQuestionFABProps {
  onClick: () => void;
}

const QuickQuestionFAB: React.FC<QuickQuestionFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      title="Ask a Quick Question"
      className="fixed bottom-24 right-6 bg-accent hover:bg-accent-hover text-text-on-accent rounded-full p-4 shadow-lg z-40 transition-transform hover:scale-110"
    >
      <SparklesIcon className="h-6 w-6" />
    </button>
  );
};

export default QuickQuestionFAB;
