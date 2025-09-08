import React from 'react';
import { DESIGN_TIER_INFO } from '../constants';

interface TierTooltipProps {
  tier: 'Bronze' | 'Silver' | 'Gold';
  children: React.ReactNode;
}

const TierTooltip: React.FC<TierTooltipProps> = ({ tier, children }) => {
  const tierInfo = DESIGN_TIER_INFO[tier];

  return (
    <div className="relative group flex">
      {children}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white p-3 rounded-lg border border-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <h4 className="font-bold text-gray-800 text-md mb-2">{tierInfo.title}</h4>
        <ul className="space-y-1 text-xs text-gray-600">
          <li className="flex items-start"><strong className="w-16 flex-shrink-0">Focus:</strong> <span>{tierInfo.focus}</span></li>
          <li className="flex items-start"><strong className="w-16 flex-shrink-0">Goal:</strong> <span>{tierInfo.goal}</span></li>
          <li className="flex items-start"><strong className="w-16 flex-shrink-0">Hardware:</strong> <span>{tierInfo.hardware}</span></li>
        </ul>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-lg -mt-px"></div>
      </div>
    </div>
  );
};

export default TierTooltip;
