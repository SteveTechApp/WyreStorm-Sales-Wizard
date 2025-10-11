import React, { useState } from 'react';
import { askQuickQuestion } from '../services/assistantService.ts';
import LoadingSpinner from './LoadingSpinner.tsx';
import QuickQuestionResult from './quickQuestion/QuickQuestionResult.tsx';
import { useUserContext } from '../context/UserContext.tsx';
import InfoModal from './InfoModal.tsx';

interface QuickQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickQuestionModal: React.FC<QuickQuestionModalProps> = ({ isOpen, onClose }) => {
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
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-3xl" title="Quick Question">
      <div>
        {result || isLoading || error ? (
           <QuickQuestionResult 
              query={query} 
              result={result} 
              isLoading={isLoading} 
              error={error} 
              onReset={resetSearch} 
           />
        ) : (
          <>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="quick-question-input" className="sr-only">Ask a technical or product question</label>
              <input
                type="text"
                id="quick-question-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a technical or product question..."
                className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 ring-offset-background-secondary focus:ring-accent shadow-lg"
              />
            </form>
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Or try one of these:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRESET_QUESTIONS.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => handlePresetClick(q)}
                    className="text-left p-3 bg-background hover:bg-border-color rounded-md text-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </InfoModal>
  );
};

export default QuickQuestionModal;
