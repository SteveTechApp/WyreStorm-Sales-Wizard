import React from 'react';
// FIX: Use specific context hook instead of general useAppContext
import { useProjectContext } from '../../context/ProjectContext.tsx';
import IoDeviceCard from './IoDeviceCard.tsx';

const InputsPanel: React.FC = () => {
    // FIX: Destructure from the correct, specific context
    const { projectData, activeRoomId } = useProjectContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);
    const inputs = room?.ioRequirements.filter(io => io.type === 'input') || [];

    return (
        <div className="p-4 bg-background-secondary rounded-lg border border-border-color">
            <h3 className="font-bold text-lg mb-4">Inputs</h3>
            <div className="space-y-3">
                {inputs.length > 0 ? (
                    inputs.map(input => <IoDeviceCard key={input.id} point={input} />)
                ) : (
                    <p className="text-sm text-text-secondary text-center py-4">No inputs defined for this room.</p>
                )}
            </div>
        </div>
    );
};

export default InputsPanel;