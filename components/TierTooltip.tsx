



import React from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { DesignTier } from '../utils/types.ts';
import TierIcon from './TierIcon.tsx';

const TIER_DETAILS: Record<DesignTier, { description: string }> = {
    Bronze: {
        description: 'Focuses on core functionality and cost-effectiveness. Ideal for budget-conscious projects.'
    },
    Silver: {
        description: 'A balance of performance and value, with enhanced features and flexibility. The most common choice.'
    },
    Gold: {
        description: 'Prioritizes performance, scalability, and cutting-edge features like AVoIP and networked audio.'
    }
};

const TierTooltip: React.FC<{ tier: DesignTier }> = ({ tier }) => {
    const { description } = TIER_DETAILS[tier];

    return (
        <div className="relative group">
            <TierIcon tier={tier} className="h-5 w-5" />
            <div className="absolute bottom-full mb-2 w-48 p-2 bg-background-secondary text-text-primary text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                <p className="font-bold">{tier} Tier</p>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default TierTooltip;