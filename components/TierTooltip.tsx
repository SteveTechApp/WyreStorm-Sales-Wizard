
import React from 'react';
import { DesignTier } from '../utils/types';

const TIER_DETAILS: Record<DesignTier, { color: string; description: string }> = {
    Bronze: {
        color: 'text-[#cd7f32]',
        description: 'Focuses on core functionality and cost-effectiveness. Ideal for budget-conscious projects.'
    },
    Silver: {
        color: 'text-gray-400',
        description: 'A balance of performance and value, with enhanced features and flexibility. The most common choice.'
    },
    Gold: {
        color: 'text-yellow-400',
        description: 'Prioritizes performance, scalability, and cutting-edge features like AVoIP and networked audio.'
    }
};

const TierTooltip: React.FC<{ tier: DesignTier }> = ({ tier }) => {
    const { color, description } = TIER_DETAILS[tier];

    return (
        <div className="relative group">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${color}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="absolute bottom-full mb-2 w-48 p-2 bg-background-secondary text-text-primary text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                <p className="font-bold">{tier} Tier</p>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default TierTooltip;
