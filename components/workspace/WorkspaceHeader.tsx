import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext.tsx';
import { useGenerationContext } from '../../context/GenerationContext.tsx';
import { useNavigate } from 'react-router-dom';
import RoomSelectorDropdown from '../RoomSelectorDropdown.tsx';
import EditProjectDetailsModal from '../EditProjectDetailsModal.tsx';
import ProjectFinancialsModal from '../ProjectFinancialsModal.tsx';

const WorkspaceHeader: React.FC = () => {
    const { projectData } = useProjectContext();
    const { handleGenerateProposal } = useGenerationContext();
    const navigate = useNavigate();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isFinancialsModalOpen, setIsFinancialsModalOpen] = useState(false);

    if (!projectData) return null;

    return (
        <>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-wider">{projectData.projectName}</h1>
                    <p className="text-text-secondary">// Client: {projectData.clientName}</p>
                </div>
                <div className="flex items-center gap-3">
                    <RoomSelectorDropdown />
                    <button onClick={() => setIsDetailsModalOpen(true)} className="text-sm font-medium text-accent hover:underline uppercase">Edit</button>
                    <button onClick={() => setIsFinancialsModalOpen(true)} className="text-sm font-medium text-accent hover:underline uppercase">Financials</button>
                    <button 
                        onClick={() => handleGenerateProposal(projectData, navigate)}
                        className="btn btn-primary"
                    >
                        Generate Proposal
                    </button>
                </div>
            </div>
            <EditProjectDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} />
            <ProjectFinancialsModal isOpen={isFinancialsModalOpen} onClose={() => setIsFinancialsModalOpen(false)} />
        </>
    );
};

export default WorkspaceHeader;