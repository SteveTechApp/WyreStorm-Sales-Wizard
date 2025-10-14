import React, { useState } from 'react';
import { useGenerationContext } from '../../../context/GenerationContext.tsx';
import { useProjectContext } from '../../../context/ProjectContext.tsx';
import RoomWizard from '../../RoomWizard.tsx';
import SaveTemplateModal from '../../SaveTemplateModal.tsx';
import { useUserTemplates } from '../../../hooks/useUserTemplates.ts';
import { SparklesIcon } from '../../Icons.tsx';

const RoomActionsPanel: React.FC = () => {
    const { handleDesignRoom, handleGenerateDiagram } = useGenerationContext();
    const { projectData, activeRoomId, dispatchProjectAction } = useProjectContext();
    const { handleSaveTemplate } = useUserTemplates();
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

    const room = projectData?.rooms.find(r => r.id === activeRoomId);

    const handleDesign = () => {
        if (activeRoomId) {
            handleDesignRoom(activeRoomId);
        }
    };
    
    const handleDiagram = () => {
        if (activeRoomId) {
            handleGenerateDiagram(activeRoomId);
        }
    };

    if (!room) return null;

    return (
        <>
            <div className="p-6 bg-background-secondary rounded-xl shadow-xl border border-border-color">
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleDesign}
                        className="w-full btn btn-primary text-sm flex items-center justify-center gap-2 animate-pulse-bright"
                    >
                        <SparklesIcon className="h-5 w-5" />
                        AI Design Room
                    </button>
                    <button
                        onClick={handleDiagram}
                        className="w-full btn btn-primary text-sm"
                    >
                        AI Generate Diagram
                    </button>
                    <button onClick={() => setIsWizardOpen(true)} className="w-full btn btn-secondary text-sm">
                        Manual Config
                    </button>
                    <button onClick={() => setIsTemplateModalOpen(true)} className="w-full btn btn-secondary text-sm">
                        Save as Template
                    </button>
                </div>
            </div>
            <RoomWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                onSave={(updatedRoom) => dispatchProjectAction({ type: 'UPDATE_ROOM', payload: updatedRoom })}
                initialData={room}
            />
            <SaveTemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSave={handleSaveTemplate}
                roomData={room}
            />
        </>
    );
};

export default RoomActionsPanel;