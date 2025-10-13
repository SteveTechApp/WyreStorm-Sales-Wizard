import React, { useState } from 'react';
import { askQuickQuestion } from '../services/assistantService.ts';
import QuickQuestionResult from './quickQuestion/QuickQuestionResult.tsx';
import { useUserContext } from '../context/UserContext.tsx';

const QuickQuestionPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useUserContext();
  
  const PRESET_QUESTIONS = [
    "What's the difference between HDBaseT Class A and B?",
    "When should I use the NetworkHD 500 series?",
    "What is HDCP 2.2 required for?",
    "Explain chroma subsampling 4:4:4 vs 4:2:0.",
  ];

  const handleSubmit = async (currentQuery: string) => {
    if (!currentQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await askQuickQuestion(currentQuery, userProfile);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (question: string) => {
    setQuery(question);
    handleSubmit(question);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(query);
  };
  
  const resetSearch = () => {
      setQuery('');
      setResult(null);
      setError(null);
      setIsLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-fast">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-accent mb-2 uppercase tracking-widest">Quick Question</h1>
            <p className="text-lg text-text-secondary">Ask a technical or product question about WyreStorm technology.</p>
        </div>
      
        {result || isLoading || error ? (
           <QuickQuestionResult 
              query={query} 
              result={result} 
              isLoading={isLoading} 
              error={error} 
              onReset={resetSearch} 
           />
        ) : (
          <div className="bg-background-secondary p-6 rounded-xl shadow-xl border border-border-color">
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="quick-question-input" className="sr-only">Ask a technical or product question</label>
              <input
                type="text"
                id="quick-question-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Explain chroma subsampling 4:4:4 vs 4:2:0"
                className="w-full p-3 rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 ring-offset-background focus:ring-accent shadow-sm border border-border-color"
              />
            </form>
            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-center">Or try one of these common questions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRESET_QUESTIONS.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => handlePresetClick(q)}
                    className="text-left p-3 bg-background hover:bg-input-bg rounded-md text-sm border border-border-color transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default QuickQuestionPage;