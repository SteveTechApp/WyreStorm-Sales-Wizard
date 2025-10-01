import React, { useState, useEffect } from 'react';
import { useProjectContext } from '@/context/ProjectContext';

interface EditProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProjectDetailsModal: React.FC<EditProjectDetailsModalProps> = ({ isOpen, onClose }) => {
  const { projectData, dispatchProjectAction } = useProjectContext();
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.projectName);
      setClientName(projectData.clientName);
    }
  }, [projectData, isOpen]);

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

  const handleSave = () => {
    dispatchProjectAction({ 
      type: 'UPDATE_PROJECT_DETAILS', 
      payload: { projectName, clientName }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-primary">Edit Project Details</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-project-name" className="block text-sm font-medium text-text-secondary">Project Name</label>
            <input type="text" id="edit-project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full p-2 border rounded-md bg-input-bg mt-1" />
          </div>
          <div>
            <label htmlFor="edit-client-name" className="block text-sm font-medium text-text-secondary">Client Name</label>
            <input type="text" id="edit-client-name" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2 border rounded-md bg-input-bg mt-1" />
          </div>
        </div>
        <div className="p-4 bg-background flex justify-end gap-3">
          <button onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
          <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectDetailsModal;
