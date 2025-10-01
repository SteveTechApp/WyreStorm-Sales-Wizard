import React, { useState } from 'react';
import { useProjectContext } from '@/context/ProjectContext';
import { useUserContext } from '@/context/UserContext';
import { reviewRoom, analyzeProject } from '@/services/projectAnalysisService';
import { DesignFeedbackItem } from '@/utils/types';
import DesignReviewModal from './DesignReviewModal';
import LoadingSpinner from './LoadingSpinner';

const AIInsightsPanel: React.FC = () => {
    const { projectData, activeRoomId } = useProjectContext();
    const { userProfile } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedback, setFeedback] = useState<DesignFeedbackItem[]>([]);
    const [modalTitle, setModalTitle] = useState('');

    const activeRoom = projectData?.rooms.find(r => r.id === activeRoomId);

    const handleReviewRoom = async () => {
        if (!activeRoom || !projectData) return;
        setIsLoading(true);
        try {
            const result = await reviewRoom(activeRoom, projectData, userProfile);
            setFeedback(result);
            setModalTitle(`Design Review: ${activeRoom.roomName}`);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to review room:", error);
            alert("An error occurred while reviewing the room.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeProject = async () => {
        if (!projectData) return;
        setIsLoading(true);
        try {
            const result = await analyzeProject(projectData, userProfile);
            setFeedback(result);
            setModalTitle(`Project Analysis: ${projectData.projectName}`);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to analyze project:", error);
            alert("An error occurred while analyzing the project.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-secondary p-4 rounded-lg border border-border-color h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-text-primary">AI Wingman</h3>
            {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="space-y-3">
                    <button 
                        onClick={handleReviewRoom} 
                        disabled={!activeRoom} 
                        className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Review Current Room
                    </button>
                    <button 
                        onClick={handleAnalyzeProject}
                        disabled={!projectData || projectData.rooms.length === 0}
                        className="w-full bg-background hover:bg-border-color text-text-primary font-bold py-2 px-4 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Analyze Full Project
                    </button>
                </div>
            )}
            <DesignReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                feedbackItems={feedback}
                title={modalTitle}
            />
        </div>
    );
};

export default AIInsightsPanel;
