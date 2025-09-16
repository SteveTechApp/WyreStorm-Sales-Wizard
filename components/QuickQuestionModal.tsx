import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getQuickAnswer } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon, ArrowUpRightIcon } from './Icons';

interface QuickQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickQuestionModal: React.FC<QuickQuestionModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{ text: string; sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Center modal on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Reset state
      setQuestion('');
      setAnswer(null);
      setError(null);
      setIsLoading(false);

      const modal = modalRef.current;
      // Reset styles to initial
      modal.style.width = '672px';
      modal.style.height = '500px';

      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = modal;
      const x = (innerWidth - offsetWidth) / 2;
      const y = (innerHeight - offsetHeight) / 2;
      modal.style.left = `${x}px`;
      modal.style.top = `${y}px`;
    }
  }, [isOpen]);

  // --- Drag Logic ---
  const handleDragMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Ensure we are clicking on the drag handle itself, not its children
    if (e.target !== e.currentTarget) return;
    
    const modal = modalRef.current;
    if (!modal) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = modal.offsetLeft;
    const initialTop = modal.offsetTop;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      modal.style.left = `${initialLeft + dx}px`;
      modal.style.top = `${initialTop + dy}px`;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    e.preventDefault();
  }, []);

  // --- Resize Logic ---
  const handleResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const modal = modalRef.current;
    if (!modal) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = modal.offsetWidth;
    const initialHeight = modal.offsetHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      modal.style.width = `${Math.max(450, initialWidth + dx)}px`;
      modal.style.height = `${Math.max(350, initialHeight + dy)}px`;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    e.preventDefault();
    e.stopPropagation();
  }, []);

  // --- Form Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const { answer: answerText, sources } = await getQuickAnswer(question);
      setAnswer({ text: answerText, sources });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatAnswer = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/(\r\n|\n|\r)/g, '<br />')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/<\/ul><br \/><ul>/g, '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in-fast" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl flex flex-col overflow-hidden absolute" 
        onClick={e => e.stopPropagation()}
      >
        <div 
            className="flex justify-between items-center border-b p-4 flex-shrink-0 cursor-move"
            onMouseDown={handleDragMouseDown}
        >
            <div className="flex items-center gap-2 pointer-events-none">
                <SparklesIcon className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">Quick Question</h2>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none cursor-pointer">&times;</button>
        </div>
        
        <div className="p-4 flex flex-col flex-grow min-h-0">
          <form onSubmit={handleSubmit} className="flex-shrink-0">
              <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Ask about a WyreStorm product, AV technology, or design principle..."
                  className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors resize-y"
                  disabled={isLoading}
              />
              <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 flex items-center justify-center"
              >
                  {isLoading ? 'Thinking...' : 'Get Answer'}
              </button>
          </form>

          <div className="mt-4 pt-4 border-t flex-grow min-h-0 overflow-y-auto pr-2">
              {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner message="Finding an answer..." /></div>}
              {error && <div className="text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
              {answer && (
                  <div className="prose prose-sm max-w-none animate-fade-in">
                      <div dangerouslySetInnerHTML={{ __html: formatAnswer(answer.text) }} />
                      {answer.sources && answer.sources.length > 0 && (
                          <div className="mt-4">
                              <h4 className="font-semibold text-xs text-gray-500 uppercase">Sources</h4>
                              <ul className="list-none p-0 mt-1 space-y-1">
                                  {answer.sources.map((source, index) => (
                                      <li key={index}>
                                          {source.web?.uri && (
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                                <span>{source.web.title || source.web.uri}</span>
                                                <ArrowUpRightIcon />
                                            </a>
                                          )}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              )}
          </div>
        </div>

        <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
            onMouseDown={handleResizeMouseDown}
            title="Resize"
        >
         <div className="w-full h-full border-r-2 border-b-2 border-gray-400 opacity-50"/>
        </div>
      </div>
    </div>
  );
};

export default QuickQuestionModal;