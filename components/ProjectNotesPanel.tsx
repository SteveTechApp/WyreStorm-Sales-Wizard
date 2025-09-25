import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext.tsx';

// Simple debounce hook for auto-saving
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};


const ProjectNotesPanel: React.FC = () => {
    const { projectData, dispatchProjectAction } = useAppContext();
    const [notes, setNotes] = useState(projectData?.notes || '');
    const debouncedNotes = useDebounce(notes, 500);

    useEffect(() => {
        setNotes(projectData?.notes || '');
    }, [projectData?.notes, projectData?.projectId]);

    const handleSave = useCallback(() => {
        if (projectData && notes !== projectData.notes) {
            dispatchProjectAction({ type: 'UPDATE_NOTES', payload: notes });
        }
    }, [dispatchProjectAction, notes, projectData]);
    
    useEffect(() => {
        if (debouncedNotes !== projectData?.notes) {
            handleSave();
        }
    }, [debouncedNotes, projectData?.notes, handleSave]);

    if (!projectData) return null;

    return (
        <div className="bg-background-secondary p-4 rounded-lg border border-border-color h-full flex flex-col">
            <h2 className="text-xl font-bold text-text-primary font-display mb-3">
                Project Notes
            </h2>
            <p className="text-sm text-text-secondary mb-3">
                Use this space for internal notes, client feedback, or site survey details. Your notes are saved automatically.
            </p>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-grow w-full p-3 border border-border-color rounded-md bg-input-bg focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                placeholder="Start typing your notes here..."
            />
        </div>
    );
};


export default ProjectNotesPanel;
