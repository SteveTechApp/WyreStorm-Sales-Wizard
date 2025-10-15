import React from 'react';
import { useProjectContext } from '../../context/ProjectContext.tsx';
import TierIcon from '../TierIcon.tsx';
import RoomWizard from '../RoomWizard.tsx';
import SaveTemplateModal from '../SaveTemplateModal.tsx';
import { useUserTemplates } from '../../hooks/useUserTemplates.ts';

const RoomSummaryPanel: React.FC = () => {
    const { projectData, activeRoomId, dispatchProjectAction } = useProjectContext();
    const { handleSaveTemplate } = useUserTemplates();
    const [isWizardOpen, setIsWizardOpen] = React.useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);

    const room = projectData?.rooms.find(r => r.id === activeRoomId);

    if (!room) return null;

    return (
        <>
            <div className="p-4 bg-background-secondary rounded-xl shadow-lg border border-border-color">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <TierIcon tier={room.designTier} className="h-6 w-6" />
                            <h2 className="text-xl font-bold">{room.roomName}</h2>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
                            <span><strong>Type:</strong> {room.roomType}</span>
                            <span><strong>Dimensions:</strong> {room.dimensions.length}m x {room.dimensions.width}m x {room.dimensions.height}m</span>
                            <span><strong>Capacity:</strong> {room.maxParticipants} people</span>
                            <span><strong>Displays:</strong> {room.displayCount} ({room.displayType.replace(/_/g, ' ')})</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                         <button onClick={() => setIsWizardOpen(true)} className="btn btn-secondary text-sm">
                            Full Config
                        </button>
                        <button onClick={() => setIsTemplateModalOpen(true)} className="btn btn-secondary text-sm">
                            Save as Template
                        </button>
                    </div>
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

export default RoomSummaryPanel;
