import React from 'react';
import { IOPoint } from '../../utils/types.ts';
import { CONNECTION_TYPE_ICONS } from '../../data/constants.ts';

interface IoDeviceCardProps {
    point: IOPoint;
    onEdit: (point: IOPoint) => void;
    onRemove: (pointId: string) => void;
}

const getIoIconComponent = (type: string): React.FC<{ className?: string }> => {
    return CONNECTION_TYPE_ICONS[type] || CONNECTION_TYPE_ICONS['default'];
};

const DetailTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="text-xs font-mono bg-background text-text-secondary px-2 py-1 rounded-md border border-border-color-subtle">
        {children}
    </span>
);

const IoDeviceCard: React.FC<IoDeviceCardProps> = ({ point, onEdit, onRemove }) => {
    const IconComponent = getIoIconComponent(point.connectionType);

    return (
        <div className="bg-background p-3 rounded-lg border border-border-color space-y-3 transition-all hover:shadow-md hover:border-border-color">
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                    <IconComponent className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold">{point.name}</h4>
                        <p className="text-xs text-text-secondary">Quantity: {point.quantity}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => onEdit(point)} className="btn btn-secondary text-xs px-3 py-1">Edit</button>
                    <button onClick={() => onRemove(point.id)} className="text-destructive hover:underline text-xs font-semibold">Remove</button>
                </div>
            </div>
             <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-color-subtle">
                <DetailTag>{point.connectionType}</DetailTag>
                <span className="text-text-secondary text-sm" title="Transport Type">&rarr;</span>
                <DetailTag>{point.distributionType}</DetailTag>
                <span className="text-text-secondary text-sm" title="Location">@</span>
                <DetailTag>{point.terminationType}</DetailTag>
                <DetailTag>{point.distance}m</DetailTag>
            </div>
        </div>
    );
};

export default IoDeviceCard;