import React from 'react';
import { IOPoint } from '../../utils/types.ts';
import { TrashIcon, PencilIcon, DuplicateIcon } from '../Icons.tsx';

interface IOPointEditorProps {
    point: IOPoint;
    unit: 'm' | 'ft';
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
    onDuplicate: (id: string) => void;
}

const IOPointEditor: React.FC<IOPointEditorProps> = ({ point, unit, onEdit, onRemove, onDuplicate }) => {
    const displayDetails = [
        point.displayType && point.displayType !== 'single' ? point.displayType.replace(/_/g, ' ') : null,
        point.connectionType,
        point.distributionType,
        `${point.distance}${unit}`
    ].filter(Boolean).join(' | ');

    return (
        <div className="flex items-center gap-3 p-2 bg-background/50 rounded-lg border border-border-color/50 hover:border-border-color group animate-fade-in-fast">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                {point.quantity}x
            </div>
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-text-primary truncate">{point.name}</p>
                <p className="text-xs text-text-secondary capitalize truncate">
                    {displayDetails}
                </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button type="button" onClick={() => onDuplicate(point.id)} className="p-2 text-text-secondary hover:text-primary" title="Duplicate"><DuplicateIcon className="h-4 w-4" /></button>
                <button type="button" onClick={() => onEdit(point.id)} className="p-2 text-text-secondary hover:text-primary" title="Edit"><PencilIcon className="h-4 w-4" /></button>
                <button type="button" onClick={() => onRemove(point.id)} className="p-2 text-text-secondary hover:text-destructive" title="Remove"><TrashIcon className="h-4 w-4" /></button>
            </div>
        </div>
    );
};

export default IOPointEditor;
