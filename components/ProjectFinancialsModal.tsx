import React, { useState, useEffect } from 'react';
import { useProjectContext } from '../context/ProjectContext.tsx';
import AncillaryCostsForm from './financials/AncillaryCostsForm.tsx';
import CostSummaryDisplay from './financials/CostSummaryDisplay.tsx';

interface ProjectFinancialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectFinancialsModal: React.FC<ProjectFinancialsModalProps> = ({ isOpen, onClose }) => {
  const { projectData } = useProjectContext();
  const [activeTab, setActiveTab] = useState('summary');

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

  if (!isOpen || !projectData) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">Project Financials</h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="border-b border-border-color mb-4">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => setActiveTab('summary')} className={`${activeTab === 'summary' ? 'border-accent text-accent' : 'border-transparent text-text-secondary'} py-2 px-1 border-b-2 font-medium text-sm`}>Cost Summary</button>
                <button onClick={() => setActiveTab('ancillary')} className={`${activeTab === 'ancillary' ? 'border-accent text-accent' : 'border-transparent text-text-secondary'} py-2 px-1 border-b-2 font-medium text-sm`}>Ancillary Costs</button>
            </nav>
          </div>
          <div>
            {activeTab === 'summary' && <CostSummaryDisplay />}
            {activeTab === 'ancillary' && <AncillaryCostsForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFinancialsModal;