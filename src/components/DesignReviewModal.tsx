import React, { useMemo, useEffect } from 'react';
import { DesignFeedbackItem } from '@/utils/types';
import FeedbackCategory from './designReview/FeedbackCategory';

interface DesignReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackItems: DesignFeedbackItem[];
  title: string;
}

const DesignReviewModal: React.FC<DesignReviewModalProps> = ({ isOpen, onClose, feedbackItems, title }) => {
  const groupedFeedback = useMemo(() => {
    return feedbackItems.reduce((acc, item) => {
      const type = item.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {} as Record<string, DesignFeedbackItem[]>);
  }, [feedbackItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-3xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
            <FeedbackCategory title="⚠️ Warnings" items={groupedFeedback['Warning']} />
            <FeedbackCategory title="💡 Suggestions" items={groupedFeedback['Suggestion']} />
            <FeedbackCategory title="🚀 Opportunities" items={groupedFeedback['Opportunity']} />
            <FeedbackCategory title="🧠 Insights" items={groupedFeedback['Insight']} />
            <FeedbackCategory title="💰 Financial" items={groupedFeedback['Financial']} />
        </div>
      </div>
    </div>
  );
};

export default DesignReviewModal;
