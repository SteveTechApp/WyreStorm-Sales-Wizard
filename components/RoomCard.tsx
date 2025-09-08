import React from 'react';
import { RoomData } from '../types';

interface RoomCardProps {
    room: RoomData;
    isActive: boolean;
    onSelect: () => void;
    onReconfigure: () => void;
    onRemove: () => void;
}

const TIER_STYLES: Record<string, { bg: string; text: string; border: string; }> = {
    'Bronze': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' },
    'Silver': { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-400' },
    'Gold': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-400' },
};

const RoomCard: React.FC<RoomCardProps> = ({ room, isActive, onSelect, onReconfigure, onRemove }) => {
    const tierStyle = TIER_STYLES[room.designTier || 'Silver'] || TIER_STYLES.Silver;

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove();
    };

    const handleReconfigure = (e: React.MouseEvent) => {
        e.stopPropagation();
        onReconfigure();
    };

    const isPlaceholder = !room.functionalityStatement;
    const buttonText = isPlaceholder ? 'Configure Room' : 'Re-Configure';


    return (
        <div 
            className={`bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-lg transition-all ${isActive ? 'border-2 border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'}`}
            onClick={onSelect}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800 truncate">{room.roomName}</p>
                    <p className="text-sm text-gray-500">{room.roomType}</p>
                </div>
                {room.designTier && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>{room.designTier}</span>}
            </div>
            <p className="text-xs text-gray-600 mt-2 italic h-12 overflow-hidden">
                {room.functionalityStatement || 'This room has not been configured yet. Click below to launch the AI Room Wizard.'}
            </p>
            <div className="mt-3 pt-3 border-t flex justify-between">
                <button onClick={handleReconfigure} className="text-xs font-semibold text-blue-600 hover:underline">{buttonText}</button>
                <button onClick={handleRemove} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
            </div>
        </div>
    );
}

export default RoomCard;