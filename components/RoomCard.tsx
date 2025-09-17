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
          ? 'bg-primary/10 border-primary shadow-[0_0_15px_var(--color-shadow)]'
          : 'bg-card border-border-color hover:border-border-color/70 hover:shadow-sm hover:bg-card-hover'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-text-primary">{room.roomName}</h4>
          <p className="text-sm text-text-secondary">{room.roomType}</p>
        </div>
        <div className="relative group">
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                room.designTier === 'Bronze' ? 'bg-yellow-800/80 border-yellow-600 text-white' :
                room.designTier === 'Silver' ? 'bg-slate-600/80 border-slate-400 text-white' :
                'bg-amber-700/80 border-amber-500 text-white'
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
          className="font-medium text-primary hover:underline"
        >
          Reconfigure
        </button>
        <div className="flex flex-col text-right">
            <span className="text-text-secondary">{room.maxParticipants} Participants</span>
            <span className="text-text-secondary/70">{featureCount} {featureCount === 1 ? 'Feature' : 'Features'}</span>
        </div>
      </div>
       <button 
          onClick={handleRemoveClick}
          className="absolute top-1 right-1 p-1 text-text-secondary/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove Room"
        >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default RoomCard;