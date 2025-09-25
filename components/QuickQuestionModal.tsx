import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getQuickAnswer } from '../services/assistantService';
import LoadingSpinner from './LoadingSpinner.tsx';
import { ArrowUpRightIcon } from './Icons.tsx';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';

interface QuickQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickQuestionModal: React.FC<QuickQuestionModalProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useAppContext();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ answer: string; sources: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setQuery('');
      setResult(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await getQuickAnswer(query, userProfile);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Ask a Quick Question</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g., What is the best camera for a Silver tier classroom?"
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008A3A] focus:outline-none"
              disabled={isLoading}
              autoFocus
            />
            <button type="submit" disabled={isLoading || !query.trim()} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400">
                Ask
            </button>
        </form>

        <div className="mt-4 flex-grow overflow-y-auto max-h-[60vh] min-h-[200px] border rounded-md p-4 bg-gray-50/50">
            {isLoading && <LoadingSpinner message="Thinking..." />}
            {error && <p className="text-red-600">Error: {error}</p>}
            {result && (
                <div className="animate-fade-in-fast">
                    <div className="prose max-w-none prose-p:text-gray-800">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.answer}</ReactMarkdown>
                    </div>
                    {result.sources && result.sources.length > 0 && (
                        <div className="mt-6 border-t pt-3">
                            <h4 className="font-semibold text-sm text-gray-600">Sources:</h4>
                            <ul className="mt-2 space-y-1">
                                {result.sources.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                            <span>{source.web.title || source.web.uri}</span>
                                            <ArrowUpRightIcon className="flex-shrink-0 h-3 w-3" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
             {!isLoading && !result && !error && (
                <div className="text-center text-gray-500 flex items-center justify-center h-full">
                    <p>Ask a question about WyreStorm products or AV design.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuickQuestionModal;