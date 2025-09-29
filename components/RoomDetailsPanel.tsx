import React from 'react';
import { useProjectContext } from '../context/ProjectContext.tsx';
import TierIcon from './TierIcon.tsx';

const RoomDetailsPanel: React.FC = () => {
    const { projectData, activeRoomId } = useProjectContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);

    if (!room) {
        return (
            <div className="bg-background-secondary p-4 rounded-lg border border-border-color">
                <p className="text-text-secondary">No room selected.</p>
            </div>
        );
    }

    return (
        <div className="bg-background-secondary p-4 rounded-lg border border-border-color h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                <TierIcon tier={room.designTier} className="h-6 w-6" />
                <h3 className="font-bold text-lg text-text-primary">{room.roomName}</h3>
            </div>
            <p className="text-sm text-text-secondary font-medium mb-4">{room.roomType}</p>
            
            <p className="text-sm text-text-primary flex-grow bg-background p-3 rounded-md border border-border-color/50">
                {room.functionalityStatement}
            </p>
        </div>
    );
};

export default RoomDetailsPanel;