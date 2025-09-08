import React, { useState } from 'react';
import { answerQuickQuestion } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface QuickQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickQuestionModal: React.FC<QuickQuestionModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const result = await answerQuickQuestion(question);
      setAnswer(result);
    } catch (err) {
      setError('The AI failed to answer the question. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setQuestion('');
    setAnswer(null);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Quick Question</h2>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="flex-grow space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g., Which extenders handle USB?"
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !question.trim()} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400">
              {isLoading ? '...' : 'Ask'}
            </button>
          </form>

          <div className="bg-gray-50 border rounded-md p-4 min-h-[150px] max-h-[40vh] overflow-y-auto">
            {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner message="Thinking..." /></div>}
            {error && <p className="text-red-600">{error}</p>}
            {answer && (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br />').replace(/\* /g, '• ') }} />
            )}
            {!isLoading && !answer && !error && (
              <p className="text-gray-500 text-center pt-8">Ask a technical or product-related question.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickQuestionModal;