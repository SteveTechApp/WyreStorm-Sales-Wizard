import React, { useState } from 'react';
import { useProjectContext } from '@/context/ProjectContext';
import ProjectNotesModal from './ProjectNotesModal';

const ProjectNotesPanel: React.FC = () => {
    const { projectData } = useProjectContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const notesPreview = projectData?.notes ? `${projectData.notes.substring(0, 200)}...` : 'No project notes yet.';

    return (
        <div className="bg-background-secondary p-4 rounded-lg border border-border-color h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-text-primary">Project Notes</h3>
                <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-accent hover:underline">
                    Edit
                </button>
            </div>
            <p className="text-sm text-text-secondary flex-grow whitespace-pre-wrap">
                {notesPreview}
            </p>
             <ProjectNotesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ProjectNotesPanel;
