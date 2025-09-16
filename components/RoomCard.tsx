import React from 'react';
import { RoomData } from '../utils/types';
import TierTooltip from './TierTooltip';

interface RoomCardProps {
  room: RoomData;
  isActive: boolean;
  onSelect: () => void;
  onReconfigure: () => void;
  onRemove: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isActive, onSelect, onReconfigure, onRemove }) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing when deleting
    onRemove();
  };

  const featureCount = room.features?.length || 0;

  return (
    <div
      onClick={onSelect}
      className={`p-3 border rounded-lg cursor-pointer transition-all group relative ${
        isActive
          ? 'bg-green-50 border-green-400 shadow-md'
          : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-800">{room.roomName}</h4>
          <p className="text-sm text-gray-500">{room.roomType}</p>
        </div>
        <div className="relative group">
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                room.designTier === 'Bronze' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                room.designTier === 'Silver' ? 'bg-slate-200 text-slate-800 border-slate-400' :
                'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              {room.designTier}
            </span>
            <TierTooltip tier={room.designTier} />
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center text-xs">
        <button
          onClick={(e) => { e.stopPropagation(); onReconfigure(); }}
          className="font-medium text-blue-600 hover:underline"
        >
          Reconfigure
        </button>
        <div className="flex flex-col text-right">
            <span className="text-gray-500">{room.maxParticipants} Participants</span>
            <span className="text-gray-400">{featureCount} {featureCount === 1 ? 'Feature' : 'Features'}</span>
        </div>
      </div>
       <button 
          onClick={handleRemoveClick}
          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove Room"
        >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default RoomCard;