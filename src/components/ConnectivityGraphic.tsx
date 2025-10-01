import React from 'react';
import { useProjectContext } from '@/context/ProjectContext';

const ConnectivityGraphic: React.FC = () => {
    const { projectData, activeRoomId } = useProjectContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);

    const inputs = room?.ioRequirements.filter(io => io.type === 'input').length || 0;
    const outputs = room?.ioRequirements.filter(io => io.type === 'output').length || 0;
    
    return (
        <div className="bg-background-secondary p-4 rounded-lg border border-border-color h-full flex flex-col items-center justify-center">
            <h3 className="font-bold text-lg mb-4 text-text-primary text-center">Connectivity Overview</h3>
            <div className="flex items-center gap-4">
                <div className="text-center">
                    <div className="text-3xl font-bold">{inputs}</div>
                    <div className="text-sm text-text-secondary">Inputs</div>
                </div>
                <div className="text-2xl text-text-secondary">&rarr;</div>
                <div className="text-center">
                    <div className="text-3xl font-bold">{outputs}</div>
                    <div className="text-sm text-text-secondary">Outputs</div>
                </div>
            </div>
            <p className="text-xs text-text-secondary mt-4 text-center">This is a placeholder for a more detailed connectivity graphic.</p>
        </div>
    );
};

export default ConnectivityGraphic;
