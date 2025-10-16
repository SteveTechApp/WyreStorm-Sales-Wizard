import React, { useState } from 'react';
import { RoomWizardAnswers, DesignTier } from '../../../utils/types.ts';
import { DESIGN_TIER_OPTIONS } from '../../../data/constants.ts';
import TierTooltip from '../../TierTooltip.tsx';
import TierInfoModal from '../../TierInfoModal.tsx';
import TierIcon from '../../TierIcon.tsx';

interface DesignTierSelectorProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const DesignTierSelector: React.FC<DesignTierSelectorProps> = ({ answers, updateAnswers }) => {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Design Tier</h3>
                <button type="button" onClick={() => setIsInfoModalOpen(true)} className="text-sm font-medium text-accent hover:underline">What do these mean?</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DESIGN_TIER_OPTIONS.map(tier => (
                    <TierTooltip tier={tier} key={tier}>
                        <button
                            type="button"
                            onClick={() => updateAnswers({ designTier: tier })}
                            className={`p-4 border-2 rounded-lg text-left w-full h-full flex flex-col justify-between transition-all duration-200 ${answers.designTier === tier ? 'border-accent bg-accent-bg-subtle shadow-lg shadow-accent/20 ring-1 ring-accent' : 'border-border-color hover:border-accent-border-subtle'}`}
                        >
                            <div className="flex items-center gap-2">
                                <TierIcon tier={tier} className="h-6 w-6" />
                                <span className="font-bold text-lg">{tier}</span>
                            </div>
                            <p className="text-xs text-text-secondary mt-2">
                                {tier === 'Bronze' && 'Core functionality and cost-effectiveness.'}
                                {tier === 'Silver' && 'Balanced performance and value with enhanced features.'}
                                {tier === 'Gold' && 'Cutting-edge features for high-usage spaces.'}
                            </p>
                        </button>
                    </TierTooltip>
                ))}
            </div>
            <TierInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
        </div>
    );
};

export default DesignTierSelector;