import React from 'react';
import { useProjectContext } from '../context/ProjectContext.tsx';
import TierIcon from './TierIcon.tsx';
import { VERTICAL_MARKETS } from '../data/constants.ts';

// Simple mapping from a detailed room type to a broader vertical category
const roomTypeToVerticalMap: Record<string, string> = {
    'Conference Room': 'corp',
    'Boardroom': 'corp',
    'Huddle Space': 'corp',
    'Classroom': 'edu',
    'Lecture Hall': 'edu',
    'Auditorium': 'ven',
    'House of Worship': 'how',
    'Command Center': 'cmd',
    'Sports Bar': 'hos',
    'Retail Space': 'ret',
    'Large Venue': 'ven',
    'Other': 'corp', // default
};

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

    const verticalId = roomTypeToVerticalMap[room.roomType] || 'corp';
    const verticalInfo = VERTICAL_MARKETS.find(v => v.verticalId === verticalId);
    const imageUrl = verticalInfo?.imageUrl;

    return (
        <div className="bg-background-secondary rounded-lg border border-border-color h-full flex flex-col overflow-hidden">
            {imageUrl && (
                <div className="h-32 w-full overflow-hidden">
                     <img src={imageUrl} alt={room.roomType} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                    <TierIcon tier={room.designTier} className="h-6 w-6" />
                    <h3 className="font-bold text-lg text-text-primary">{room.roomName}</h3>
                </div>
                <p className="text-sm text-text-secondary font-medium mb-4">{room.roomType}</p>
                
                <p className="text-sm text-text-primary flex-grow bg-background p-3 rounded-md border border-border-color/50">
                    {room.functionalityStatement}
                </p>
            </div>
        </div>
    );
};

export default RoomDetailsPanel;