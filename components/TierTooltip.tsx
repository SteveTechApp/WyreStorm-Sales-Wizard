import React from 'react';
import { DESIGN_TIER_INFO } from '../constants';
import { RoomData } from '../types';

interface TierTooltipProps {
  tier: 'Bronze' | 'Silver' | 'Gold';
}

const TierTooltip: React.FC<TierTooltipProps> = ({ tier }) => {
  const info = DESIGN_TIER_INFO[tier];

  if (!info) return null;

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
      <h4 className="font-bold text-sm mb-1">{info.title}</h4>
      <p><span className="font-semibold">Focus:</span> {info.focus}</p>
      <p><span className="font-semibold">Goal:</span> {info.goal}</p>
      <p><span className="font-semibold">Hardware:</span> {info.hardware}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
    </div>
  );
};

export default TierTooltip;
