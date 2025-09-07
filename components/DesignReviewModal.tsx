
import React from 'react';
import { DesignFeedbackItem } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface DesignReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: DesignFeedbackItem[] | null;
  isLoading: boolean;
}

const FEEDBACK_STYLES = {
  Warning: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    ),
    title: 'Warnings',
    borderColor: 'border-red-500',
  },
  Suggestion: {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    title: 'Suggestions',
    borderColor: 'border-blue-500',
  },
  Opportunity: {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    ),
    title: 'Opportunities',
    borderColor: 'border-green-500',
  },
};

const DesignReviewModal: React.FC<DesignReviewModalProps> = ({ isOpen, onClose, feedback, isLoading }) => {
  if (!isOpen) return null;

  const renderFeedbackCategory = (type: DesignFeedbackItem['type']) => {
    const items = feedback?.filter(f => f.type === type);
    if (!items || items.length === 0) return null;

    const { icon, title, borderColor } = FEEDBACK_STYLES[type];

    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h3 className={`text-xl font-bold text-gray-800`}>{title}</h3>
        </div>
        <ul className={`space-y-3 border-l-4 ${borderColor} pl-4 ml-3`}>
          {items.map((item, index) => (
            <li key={index} className="text-gray-700 text-sm">{item.text}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Design Review</h2>
        {isLoading && <LoadingSpinner message="Analyzing Design..." />}
        {!isLoading && feedback && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
            {renderFeedbackCategory('Warning')}
            {renderFeedbackCategory('Suggestion')}
            {renderFeedbackCategory('Opportunity')}
            {feedback.length === 0 && (
                <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="mt-4 font-semibold text-gray-700">Looks good! The AI found no immediate issues with this design.</p>
                </div>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-6 rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignReviewModal;
