import React, { useState } from 'react';
import { TrainingModule } from '../../utils/types.ts';
// A basic markdown parser could be used here in a real app
import ReactMarkdown from 'react-markdown';

interface TrainingModuleViewProps {
  module: TrainingModule;
  onComplete: () => void;
}

const TrainingModuleView: React.FC<TrainingModuleViewProps> = ({ module, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const page = module.contentPages[currentPage];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
      <h2 className="text-xl text-text-secondary mb-6">{page.title}</h2>
      
      <div className="prose dark:prose-invert max-w-none mb-6">
          <ReactMarkdown>{page.content}</ReactMarkdown>
      </div>

      {page.asset && (
        <div className="my-6 p-4 border rounded-lg text-center bg-background-secondary">
            <img src={page.asset.url} alt={page.asset.title} className="max-w-full mx-auto rounded-md" />
            <p className="text-sm text-text-secondary italic mt-2">{page.asset.title}</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 0}
          className="bg-background-secondary hover:bg-border-color font-bold py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-sm text-text-secondary">Page {currentPage + 1} of {module.contentPages.length}</p>
        {currentPage === module.contentPages.length - 1 ? (
          <button onClick={onComplete} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-lg">
            Start Quiz
          </button>
        ) : (
          <button onClick={() => setCurrentPage(p => p + 1)} className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainingModuleView;