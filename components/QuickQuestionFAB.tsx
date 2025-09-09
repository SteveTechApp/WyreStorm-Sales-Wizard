import React from 'react';

interface QuickQuestionFABProps {
  onClick: () => void;
}

const QuickQuestionFAB: React.FC<QuickQuestionFABProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-30">
      <button 
        onClick={onClick}
        className="bg-[#D71A21] hover:bg-red-700 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        title="Ask a Quick Question"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
    </div>
  );
};

export default QuickQuestionFAB;
