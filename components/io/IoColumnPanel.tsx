import React from 'react';
import { useProjectContext } from '../../context/ProjectContext.tsx';
import IoDeviceCard from './IoDeviceCard.tsx';

interface IoColumnPanelProps {
    title: string;
    type: 'input' | 'output';
}

const IoColumnPanel: React.FC<IoColumnPanelProps> = ({ title, type }) => {
    const { projectData, activeRoomId } = useProjectContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);
    const points = room?.ioRequirements.filter(io => io.type === type) || [];

    return (
        <div className="p-6 bg-background-secondary rounded-xl shadow-xl border border-border-color">
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            <div className="space-y-3">
                {points.length > 0 ? (
                    points.map(point => <IoDeviceCard key={point.id} point={point} />)
                ) : (
                    <p className="text-sm text-text-secondary text-center py-4">No {type}s defined for this room.</p>
                )}
            </div>
        </div>
    );
};

export default IoColumnPanel;