import React, { useState } from 'react';
import { useGenerationContext } from '../../../context/GenerationContext.tsx';
import { useProjectContext } from '../../../context/ProjectContext.tsx';
import RoomWizard from '../../RoomWizard.tsx';
import SaveTemplateModal from '../../SaveTemplateModal.tsx';
import { useUserTemplates } from '../../../hooks/useUserTemplates.ts';

const RoomActionsPanel: React.FC = () => {
    const { handleDesignRoom } = useGenerationContext();
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
    
    if (!room) return null;

    return (
        <>
            <div className="mfd-panel">
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={handleDesign}
                        className="w-full btn btn-primary text-sm"
                    >
                        AI Design
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