import React, { useState, useCallback } from 'react';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
// FIX: Add file extension to satisfy module resolution for types.ts
import { DesignFeedbackItem, RoomData } from '../utils/types.ts';
import { getProjectInsights, getRoomReview } from '../services/projectAnalysisService.ts';
import LoadingSpinner from './LoadingSpinner.tsx';
import { SparklesIcon } from './Icons.tsx';

const FEEDBACK_STYLES: Record<string, any> = {
  Warning: { icon: '⚠️', color: 'text-red-500' },
  Suggestion: { icon: '💡', color: 'text-blue-500' },
  Opportunity: { icon: '🚀', color: 'text-green-500' },
  Insight: { icon: '🔍', color: 'text-gray-500' },
  Financial: { icon: '💰', color: 'text-purple-500' },
};

interface AIInsightsPanelProps {
  selectedRoom: RoomData | null | undefined;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ selectedRoom }) => {
  const { projectData, userProfile } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<DesignFeedbackItem[] | null>(null);

  const handleReview = useCallback(async (scope: 'project' | 'room') => {
    if (!projectData || !userProfile) return;
    if (scope === 'room' && !selectedRoom) return;

    setIsLoading(true);
    setFeedback(null);
    try {
      const results = scope === 'project'
        ? await getProjectInsights(projectData, userProfile)
        : await getRoomReview(selectedRoom!, projectData, userProfile);
      setFeedback(results);
    } catch (error) {
      console.error(error);
      setFeedback([{ type: 'Warning', text: 'Failed to get insights. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [projectData, userProfile, selectedRoom]);

  return (
    <div className="bg-background-secondary p-4 rounded-lg border border-border-color h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-text-primary font-display flex items-center gap-2">
          <SparklesIcon className="h-6 w-6 text-accent" />
          AI Design Review
        </h2>
      </div>
      <div className="flex gap-2 mb-3">
        <button onClick={() => handleReview('project')} disabled={isLoading} className="flex-1 text-sm bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-3 rounded-md transition-colors disabled:opacity-50">
          Review Project
        </button>
        <button onClick={() => handleReview('room')} disabled={isLoading || !selectedRoom} className="flex-1 text-sm bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-3 rounded-md transition-colors disabled:opacity-50">
          Review Room
        </button>
      </div>

      <div className="flex-grow overflow-y-auto bg-background p-2 rounded-md border border-border-color min-h-0">
        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner message="Analyzing..." /></div>}
        {!isLoading && feedback && (
          feedback.length > 0 ? (
            <ul className="space-y-3">
              {feedback.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className={`flex-shrink-0 ${FEEDBACK_STYLES[item.type]?.color}`}>{FEEDBACK_STYLES[item.type]?.icon}</span>
                  <span className="text-text-secondary">{item.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center h-full text-center text-text-secondary">
              <p>No issues found. Click a button above to start a review.</p>
            </div>
          )
        )}
         {!isLoading && !feedback && (
             <div className="flex justify-center items-center h-full text-center text-text-secondary">
                <p>Click a button above to get AI-powered feedback on your design.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default AIInsightsPanel;