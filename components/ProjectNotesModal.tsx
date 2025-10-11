import React, { useState, useEffect } from 'react';
import { useProjectContext } from '../context/ProjectContext.tsx';
import InfoModal from './InfoModal.tsx';

interface ProjectNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectNotesModal: React.FC<ProjectNotesModalProps> = ({ isOpen, onClose }) => {
  const { projectData, dispatchProjectAction } = useProjectContext();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && projectData) {
      setNotes(projectData.notes);
    }
  }, [isOpen, projectData]);

  if (!isOpen) return null;

  const handleSave = () => {
    dispatchProjectAction({ type: 'UPDATE_NOTES', payload: notes });
    onClose();
  };

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="flex justify-between items-center p-4 border-b border-border-color">
        <h2 className="text-2xl font-bold text-text-primary">Project Notes</h2>
        <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
      </div>
      <div className="p-6 flex-grow">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-full p-2 border rounded-md bg-input-bg resize-none"
          placeholder="Add project-wide notes here..."
        />
      </div>
      <div className="p-4 bg-background flex justify-end gap-3 border-t border-border-color">
        <button onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
        <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save Notes</button>
      </div>
    </InfoModal>
  );
};

export default ProjectNotesModal;