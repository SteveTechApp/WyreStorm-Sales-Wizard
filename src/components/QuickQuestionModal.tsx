import React, { useState, useEffect } from 'react';
import { askQuickQuestion } from '@/services/assistantService';
import LoadingSpinner from './LoadingSpinner';
import QuickQuestionResult from './quickQuestion/QuickQuestionResult';
import { useUserContext } from '@/context/UserContext';

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
          <h2 className="text-2xl font-bold text-text-primary">Quick Question</h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
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
                  className="w-full p-3 border-2 border-border-color rounded-lg bg-input-bg focus:outline-none focus:border-accent"
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
      </div>
    </div>
  );
};

export default QuickQuestionModal;
