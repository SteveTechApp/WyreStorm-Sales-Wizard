import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext.tsx';
import { useUserContext } from '../context/UserContext.tsx';
import { reviewRoom, analyzeProject } from '../services/projectAnalysisService.ts';
import { DesignFeedbackItem } from '../utils/types.ts';
import DesignReviewModal from './DesignReviewModal.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';

const AIInsightsPanel: React.FC = () => {
    const { projectData, activeRoomId } = useProjectContext();
    const { userProfile } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedback, setFeedback] = useState<DesignFeedbackItem[]>([]);
    const [modalTitle, setModalTitle] = useState('');
    const [lastAction, setLastAction] = useState<'room' | 'project' | null>(null);

    const activeRoom = projectData?.rooms.find(r => r.id === activeRoomId);

    const handleReviewRoom = async () => {
        if (!activeRoom || !projectData) return;
        setLastAction('room');
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
        setLastAction('project');
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
        <div className="bg-background-secondary p-4 rounded-lg border border-border-color h-full flex flex-col shadow-lg">
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
                        className="w-full btn-accent text-white font-bold py-2 px-4 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                    
                    {lastAction === 'room' && (
                        <button
                            onClick={handleReviewRoom}
                            className="w-full flex items-center justify-center gap-2 bg-background-secondary hover:bg-border-color text-accent font-bold py-2 px-4 rounded-md text-sm border-2 border-accent-border-subtle"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691L7.985 5.964M21.015 14.644L17.834 11.46" />
                            </svg>
                            Regenerate Room Review
                        </button>
                    )}

                    {lastAction === 'project' && (
                         <button
                            onClick={handleAnalyzeProject}
                            className="w-full flex items-center justify-center gap-2 bg-background-secondary hover:bg-border-color text-accent font-bold py-2 px-4 rounded-md text-sm border-2 border-accent-border-subtle"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691L7.985 5.964M21.015 14.644L17.834 11.46" />
                            </svg>
                            Regenerate Project Analysis
                        </button>
                    )}
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