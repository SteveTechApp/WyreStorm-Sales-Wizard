import React, { useEffect } from 'react';

interface SolutionVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  // We would pass visualization data here
}

const SolutionVisualizerModal: React.FC<SolutionVisualizerModalProps> = ({ isOpen, onClose }) => {
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
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">Solution Visualizer</h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto text-center">
            <h3 className="text-lg font-semibold">AI Solution Visualization</h3>
            <p className="text-text-secondary">This is a placeholder for a future feature where AI can generate diagrams, mockups, or other visuals.</p>
        </div>
      </div>
    </div>
  );
};

export default SolutionVisualizerModal;