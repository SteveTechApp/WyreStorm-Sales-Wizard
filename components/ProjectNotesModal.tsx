import React from 'react';
import InfoModal from './InfoModal';
import ProjectNotesPanel from './ProjectNotesPanel';

interface ProjectNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: The project prop is passed from ProjectBuilder, so we keep it in the interface to match.
  // The prop is unused in this component as data is pulled from context. Removing for clarity.
}

const ProjectNotesModal: React.FC<ProjectNotesModalProps> = ({ isOpen, onClose }) => {
  return (
    <InfoModal isOpen={isOpen} onClose={onClose} title="Project Notes">
      <div className="h-[60vh] flex flex-col">
        <ProjectNotesPanel />
      </div>
    </InfoModal>
  );
};

export default ProjectNotesModal;