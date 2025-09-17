import React from 'react';

interface ProjectNotesPanelProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const ProjectNotesPanel: React.FC<ProjectNotesPanelProps> = ({ notes, onNotesChange }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-text-primary font-display">PROJECT NOTES</h2>
      </div>
      <div className="flex-grow">
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add notes, reminders, or client feedback here..."
          className="w-full h-full p-2 bg-input-bg border border-border-color rounded-md focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none text-text-primary"
        />
      </div>
    </div>
  );
};

export default ProjectNotesPanel;
