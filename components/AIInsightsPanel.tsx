import React from 'react';
import { DesignFeedbackItem } from '../utils/types';

interface AIInsightsPanelProps {
    insights: DesignFeedbackItem[];
    isLoading: boolean;
    onRefresh: () => void;
    onOpenProductFinder: () => void;
}

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const FEEDBACK_STYLES: Record<DesignFeedbackItem['type'], { icon: React.ReactElement; color: string; border: string; }> = {
  Warning: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    color: 'text-destructive',
    border: 'border-destructive',
  },
  Suggestion: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'text-blue-400',
    border: 'border-blue-400',
  },
  Opportunity: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    color: 'text-primary',
    border: 'border-primary',
  },
  Financial: {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      color: 'text-purple-400',
      border: 'border-purple-400',
  },
  Insight: {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
      color: 'text-gray-400',
      border: 'border-gray-400',
  }
};

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, isLoading, onRefresh, onOpenProductFinder }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-text-primary font-display">AI INSIGHTS</h2>
                <button onClick={onRefresh} disabled={isLoading} className="p-1 text-text-secondary hover:text-primary disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.732 1.732a9 9 0 1012.536 0M20 20l-1.732-1.732a9 0 00-12.536 0" /></svg>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                {insights.length > 0 ? insights.map((item, index) => {
                    const style = FEEDBACK_STYLES[item.type];
                    return (
                        <div key={index} className={`flex gap-3 bg-background-secondary p-3 rounded-md border-l-4 ${style.border}`}>
                           <div className={`flex-shrink-0 mt-0.5 ${style.color}`}>{style.icon}</div>
                           <div>
                                <p className="font-semibold text-sm text-text-primary uppercase">{item.type}</p>
                                <p className="text-xs text-text-secondary">{item.text}</p>
                           </div>
                        </div>
                    );
                }) : (
                    <div className="text-center text-sm text-text-secondary pt-10">
                        {isLoading ? 'Analysing...' : 'No insights yet. Add systems or make changes to get feedback.'}
                    </div>
                )}
            </div>
             <div className="mt-4 pt-4 border-t border-border-color">
                <button 
                    onClick={onOpenProductFinder}
                    className="w-full text-sm bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Find Product
                </button>
            </div>
        </div>
    );
};

export default AIInsightsPanel;