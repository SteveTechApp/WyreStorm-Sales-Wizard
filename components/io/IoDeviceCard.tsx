import React from 'react';
import { IOPoint } from '../../utils/types.ts';
import DeviceAttributeSelector from './DeviceAttributeSelector.tsx';
import AssignedInputs from './AssignedInputs.tsx';
import { useProjectContext } from '../../context/ProjectContext.tsx';
import { CONNECTION_TYPE_ICONS } from '../../data/constants.ts';
// FIX: Renamed DISTRIBUTION_TYPES to TRANSPORT_TYPES to match export from wizardOptions.
import { CONNECTION_TYPES, TRANSPORT_TYPES } from '../../data/wizardOptions.ts';

interface IoDeviceCardProps {
    point: IOPoint;
}

const getIoIconComponent = (type: string): React.FC<{ className?: string }> => {
    return CONNECTION_TYPE_ICONS[type] || CONNECTION_TYPE_ICONS['default'];
};

const IoDeviceCard: React.FC<IoDeviceCardProps> = ({ point }) => {
    const { projectData, activeRoomId, dispatchProjectAction } = useProjectContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);

    const handlePointUpdate = (newValues: Partial<IOPoint>) => {
        if (!room) return;
        const updatedPoint = { ...point, ...newValues };
        const updatedRoom = {
            ...room,
            ioRequirements: room.ioRequirements.map(p => p.id === updatedPoint.id ? updatedPoint : p)
        };
        dispatchProjectAction({ type: 'UPDATE_ROOM', payload: updatedRoom });
    };
    
    const IconComponent = getIoIconComponent(point.connectionType);

    return (
        <div className="bg-background p-3 rounded-lg border border-border-color space-y-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6 text-accent" />
                    <div>
                        <h4 className="font-bold">{point.name}</h4>
                        <p className="text-xs text-text-secondary">Quantity: {point.quantity}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <DeviceAttributeSelector
                        label="Connection"
                        value={point.connectionType}
                        options={CONNECTION_TYPES}
                        onChange={(newValue) => handlePointUpdate({ connectionType: newValue })}
                    />
                    <DeviceAttributeSelector
                        label="Distribution"
                        value={point.distributionType}
                        // FIX: Renamed DISTRIBUTION_TYPES to TRANSPORT_TYPES.
                        options={TRANSPORT_TYPES}
                        onChange={(newValue) => handlePointUpdate({ distributionType: newValue })}
                    />
                </div>
            </div>
            {point.type === 'output' && (
                <AssignedInputs outputId={point.id} />
            )}
        </div>
    );
};

export default IoDeviceCard;