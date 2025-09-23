import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const ProjectNotesPanel: React.FC = () => {
  const { projectData, dispatchProjectAction } = useAppContext();
  // Initialize state with project notes, or empty string if not available.
  const [notes, setNotes] = useState(projectData?.notes || '');

  // Effect to update local state if the notes in the context change (e.g., due to undo/redo or loading a new project).
  useEffect(() => {
    if (projectData && projectData.notes !== notes) {
      setNotes(projectData.notes);
    }
  // This dependency array ensures this effect only runs when the source of truth (projectData.notes) changes.
  // Not including `notes` here prevents potential infinite loops.
  }, [projectData?.notes]);

  // Effect to debounce saving to the global state.
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only dispatch an update if the local notes have actually changed from what's in the global state.
      if (projectData && notes !== projectData.notes) {
        dispatchProjectAction({ type: 'UPDATE_NOTES', payload: notes });
      }
    }, 500); // 500ms delay after user stops typing.

    return () => {
      clearTimeout(handler);
    };
  }, [notes, projectData, dispatchProjectAction]);


  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">No project loaded.</p>
      </div>
    );
  }

  return (
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add project notes here. They will be saved automatically and will not appear on the client proposal."
        className="w-full h-full p-3 border border-border-color rounded-md bg-input-bg focus:ring-1 focus:ring-primary focus:outline-none resize-none"
      />
  );
};

export default ProjectNotesPanel;
