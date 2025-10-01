import React from 'react';
import { useProjectContext } from '@/context/ProjectContext';
import { CockpitChevronDown, CockpitChevronUp } from './Icons';
import { Button } from './ui/Button';

const RoomSelector: React.FC = () => {
    const { projectData, activeRoomId, setActiveRoomId } = useProjectContext();

    const hasRooms = projectData && projectData.rooms.length > 0;
    const roomIndex = hasRooms ? projectData.rooms.findIndex(r => r.id === activeRoomId) : -1;
    const selectedRoom = hasRooms && roomIndex !== -1 ? projectData.rooms[roomIndex] : null;

    const cycleRoom = (direction: 'up' | 'down') => {
        if (!hasRooms || !projectData) return;
        const newIndex = direction === 'up'
            ? (roomIndex + 1) % projectData.rooms.length
            : (roomIndex - 1 + projectData.rooms.length) % projectData.rooms.length;
        setActiveRoomId(projectData.rooms[newIndex].id);
    };

    return (
        <div className="flex items-center justify-between rounded-md border border-zinc-700/60 bg-zinc-900/60 p-2">
            <span className="text-xs tracking-wider text-zinc-300 ml-2">ROOM</span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="border-zinc-600" onClick={() => cycleRoom('down')} disabled={!hasRooms} aria-label="Previous Room">
                    <CockpitChevronDown className="size-4" />
                </Button>
                <div className="min-w-48 max-w-48 truncate rounded bg-black/60 px-3 py-1 text-center font-mono text-sm tabular-nums text-[#39FF14] shadow-[inset_0_0_8px_rgba(57,255,20,0.25)]">
                    {selectedRoom ? selectedRoom.roomName : 'NO PROJECT LOADED'}
                </div>
                <Button variant="outline" size="icon" className="border-zinc-600" onClick={() => cycleRoom('up')} disabled={!hasRooms} aria-label="Next Room">
                    <CockpitChevronUp className="size-4" />
                </Button>
            </div>
        </div>
    );
};

export default RoomSelector;
