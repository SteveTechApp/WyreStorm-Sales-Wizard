import React from 'react';
import { PlusCircleIcon } from './Icons';

interface ProjectEmptyStateProps {
  onAddRoom: () => void;
}

const ProjectEmptyState: React.FC<ProjectEmptyStateProps> = ({ onAddRoom }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-border-color mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h2 className="text-xl font-bold text-text-primary">Your Project is Empty</h2>
      <p className="max-w-md mt-2 mb-6">
        Get started by adding your first room. You can define its size, features, and technical requirements using our step-by-step wizard.
      </p>
      <button
        onClick={onAddRoom}
        className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-3 px-6 rounded-md"
      >
        <PlusCircleIcon className="h-6 w-6" />
        Add Your First Room
      </button>
    </div>
  );
};

export default ProjectEmptyState;
