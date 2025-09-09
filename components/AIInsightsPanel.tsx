import React from 'react';
import { DesignFeedbackItem } from '../types';

interface AIInsightsPanelProps {
    insights: DesignFeedbackItem[];
    isLoading: boolean;
    onRefresh: () => void;
    onOpenProductFinder: () => void;
}

const FEEDBACK_STYLES: Record<DesignFeedbackItem['type'], { icon: JSX.Element; color: string; }> = {
  Warning: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    color: 'text-red-500',
  },
  Suggestion: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'text-blue-500',
  },
  Opportunity: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    color: 'text-green-500',
  },
  Financial: {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      color: 'text-purple-500',
  },
  Insight: {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
      color: 'text-gray-500',
  }
};

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, isLoading, onRefresh, onOpenProductFinder }) => {
    return (
        <div className="w-80 border-l bg-gray-50 p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-gray-800">AI Insights</h2>
                <button onClick={onRefresh} disabled={isLoading} className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.732 1.732a9 9 0 1012.536 0M20 20l-1.732-1.732a9 9 0 00-12.536 0" /></svg>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                {insights.length > 0 ? insights.map((item, index) => {
                    const style = FEEDBACK_STYLES[item.type];
                    return (
                        <div key={index} className="flex gap-3 bg-white p-3 rounded-md border-l-4 border-gray-300">
                           <div className={`flex-shrink-0 mt-0.5 ${style.color}`}>{style.icon}</div>
                           <div>
                                <p className="font-semibold text-sm text-gray-800">{item.type}</p>
                                <p className="text-xs text-gray-600">{item.text}</p>
                           </div>
                        </div>
                    );
                }) : (
                    <div className="text-center text-sm text-gray-500 pt-10">
                        {isLoading ? 'Analyzing...' : 'No insights yet. Add rooms or make changes to get feedback.'}
                    </div>
                )}
            </div>
             <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                    onClick={onOpenProductFinder}
                    className="w-full text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Find Product
                </button>
            </div>
        </div>
    );
};

export default AIInsightsPanel;