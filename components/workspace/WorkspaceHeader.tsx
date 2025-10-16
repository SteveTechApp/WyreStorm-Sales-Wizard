import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext.tsx';
import { useGenerationContext } from '../../context/GenerationContext.tsx';
import { useNavigate } from 'react-router-dom';
import RoomSelectorDropdown from '../RoomSelectorDropdown.tsx';
import EditProjectDetailsModal from '../EditProjectDetailsModal.tsx';
import ProjectNotesModal from '../ProjectNotesModal.tsx';
import DesignReviewModal from '../DesignReviewModal.tsx';
import { DesignFeedbackItem } from '../../utils/types.ts';
import { reviewRoom, analyzeProject } from '../../services/projectAnalysisService.ts';
import { useUserContext } from '../../context/UserContext.tsx';
import toast from 'react-hot-toast';

const WorkspaceHeader: React.FC = () => {
    const { projectData, activeRoomId } = useProjectContext();
    const { handleGenerateProposal } = useGenerationContext();
    const { userProfile } = useUserContext();
    const navigate = useNavigate();

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [feedback, setFeedback] = useState<DesignFeedbackItem[]>([]);
    const [isLoadingReview, setIsLoadingReview] = useState(false);
    const [reviewTitle, setReviewTitle] = useState('');

    const activeRoom = projectData?.rooms.find(r => r.id === activeRoomId);

    const handleReviewRoom = async () => {
        if (!activeRoom || !projectData) return;
        setIsLoadingReview(true);
        try {
            const result = await reviewRoom(activeRoom, projectData, userProfile);
            setFeedback(result);
            setReviewTitle(`Design Review: ${activeRoom.roomName}`);
            setIsReviewModalOpen(true);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to get AI review.");
        } finally {
            setIsLoadingReview(false);
        }
    };
    
    const handleReviewProject = async () => {
        if (!projectData) return;
        setIsLoadingReview(true);
        try {
            const result = await analyzeProject(projectData, userProfile);
            setFeedback(result);
            setReviewTitle(`Project Review: ${projectData.projectName}`);
            setIsReviewModalOpen(true);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to get project review.");
        } finally {
            setIsLoadingReview(false);
        }
    };

    const handleSaveProject = () => {
        // Project auto-saves via useEffect in useProjectManagement,
        // so this button just provides explicit user feedback.
        if (projectData) {
            toast.success(`Project "${projectData.projectName}" saved successfully!`);
        }
    };

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
                    <button onClick={() => setIsDetailsModalOpen(true)} className="btn btn-secondary text-sm">Edit Details</button>
                    <button onClick={() => setIsNotesModalOpen(true)} className="btn btn-secondary text-sm">Notes</button>
                    <button onClick={handleSaveProject} className="btn btn-secondary text-sm">Save Project</button>
                    <button onClick={handleReviewProject} className="btn btn-secondary text-sm" disabled={isLoadingReview}>
                        {isLoadingReview ? 'Analyzing...' : 'Review Project'}
                    </button>
                    <button onClick={handleReviewRoom} className="btn btn-secondary text-sm" disabled={isLoadingReview}>
                        {isLoadingReview ? 'Analyzing...' : 'Review Room'}
                    </button>
                    <button 
                        onClick={() => handleGenerateProposal(projectData, navigate)}
                        className="btn btn-primary"
                    >
                        Generate Proposal
                    </button>
                </div>
            </div>
            <EditProjectDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} />
            <ProjectNotesModal isOpen={isNotesModalOpen} onClose={() => setIsNotesModalOpen(false)} />
            <DesignReviewModal 
                isOpen={isReviewModalOpen} 
                onClose={() => setIsReviewModalOpen(false)} 
                feedbackItems={feedback}
                title={reviewTitle}
            />
        </>
    );
};

export default WorkspaceHeader;