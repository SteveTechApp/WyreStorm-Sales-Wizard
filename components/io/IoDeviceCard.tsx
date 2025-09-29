import React from 'react';
import { IOPoint } from '../../utils/types.ts';
import DeviceAttributeSelector from './DeviceAttributeSelector.tsx';
import AssignedInputs from './AssignedInputs.tsx';

interface IoDeviceCardProps {
    point: IOPoint;
}

const IoDeviceCard: React.FC<IoDeviceCardProps> = ({ point }) => {
    return (
        <div className="bg-background p-3 rounded-lg border border-border-color space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold">{point.name}</h4>
                    <p className="text-xs text-text-secondary">Quantity: {point.quantity}</p>
                </div>
                <div className="flex gap-2">
                    <DeviceAttributeSelector label="Connection" value={point.connectionType} />
                    <DeviceAttributeSelector label="Distribution" value={point.distributionType} />
                </div>
            </div>
            {point.type === 'output' && (
                <AssignedInputs outputId={point.id} />
            )}
        </div>
    );
};

export default IoDeviceCard;
