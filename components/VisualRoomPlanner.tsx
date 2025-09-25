import React from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { RoomData } from '../utils/types.ts';

interface VisualRoomPlannerProps {
    room: RoomData;
}

const VisualRoomPlanner: React.FC<VisualRoomPlannerProps> = ({ room }) => {
    return (
        <div className="bg-background p-4 rounded-lg border border-border-color h-full flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-lg font-bold text-text-primary">Visual Room Planner</h3>
                <p className="text-text-secondary mt-2 max-w-md">
                    This feature allows for a 2D layout of the room, including furniture and equipment placement to visualize coverage and user experience.
                    <br />
                    <span className="font-semibold">(This is a placeholder for a future interactive component).</span>
                </p>
                <div className="mt-4 p-4 border-2 border-dashed border-border-color rounded-md inline-block">
                    <p className="font-mono text-sm">Room: {room.roomName}</p>
                    <p className="font-mono text-sm">Dimensions: {room.dimensions.length}m x {room.dimensions.width}m</p>
                </div>
            </div>
        </div>
    );
};

export default VisualRoomPlanner;