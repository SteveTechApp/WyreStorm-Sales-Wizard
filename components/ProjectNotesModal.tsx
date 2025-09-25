import React from 'react';
import InfoModal from './InfoModal.tsx';
// FIX: Add file extension to satisfy module resolution
import ProjectNotesPanel from './ProjectNotesPanel.tsx';

interface ProjectNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
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