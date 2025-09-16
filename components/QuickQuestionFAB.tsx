import React from 'react';

interface QuickQuestionFABProps {
    onClick: () => void;
}

const QuickQuestionFAB: React.FC<QuickQuestionFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 z-30 transition-transform hover:scale-110"
      aria-label="Ask a quick question"
      title="Ask a quick question"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );
};

export default QuickQuestionFAB;
