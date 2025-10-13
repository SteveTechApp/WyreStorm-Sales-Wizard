import React from 'react';
import { UserTemplate, DesignTier } from '../utils/types.ts';
import InfoModal from './InfoModal.tsx';
import TierIcon from './TierIcon.tsx';

interface TemplateTierSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: UserTemplate | null;
  onSelectTier: (tier: DesignTier) => void;
}

const TIER_DESCRIPTIONS = {
    Bronze: {
        title: "Bronze Tier",
        description: "A cost-effective solution focusing on core functionality. Uses reliable, point-to-point connectivity like basic HDBaseT and auto-switchers. Ideal for budget-conscious projects.",
    },
    Silver: {
        title: "Silver Tier",
        description: "A balanced solution with enhanced features. This tier typically introduces better connectivity like HDBaseT Class A, USB-C inputs, and BYOM capabilities for a modern experience.",
    },
    Gold: {
        title: "Gold Tier",
        description: "A premium, future-proof solution prioritizing performance and scalability. This often involves networked AV (AVoIP), advanced audio processing, and touch panel control for the best user experience.",
    }
};

const TemplateTierSelectorModal: React.FC<TemplateTierSelectorModalProps> = ({ isOpen, onClose, template, onSelectTier }) => {
  if (!template) return null;

  const originalTier = template.roomData.designTier;

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-4xl" title={`Select a Design Tier for "${template.templateName}"`}>
      <div className="space-y-6">
        <p className="text-center text-text-secondary">This template was originally designed as a <span className="font-bold">{originalTier}</span> tier solution. You can proceed with this tier or choose another to better match your project's requirements.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['Bronze', 'Silver', 'Gold'] as DesignTier[]).map(tier => (
            <button
              key={tier}
              onClick={() => onSelectTier(tier)}
              className={`p-6 border-2 rounded-lg text-left w-full h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                originalTier === tier ? 'border-accent bg-accent/10' : 'border-border-color hover:border-accent/50 bg-background'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TierIcon tier={tier} className="h-6 w-6" />
                  <h3 className="text-xl font-bold">{TIER_DESCRIPTIONS[tier].title}</h3>
                </div>
                <p className="text-sm text-text-secondary">{TIER_DESCRIPTIONS[tier].description}</p>
              </div>
              {originalTier === tier && (
                <span className="text-xs font-bold text-accent mt-4 self-start">TEMPLATE DEFAULT</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </InfoModal>
  );
};

export default TemplateTierSelectorModal;
