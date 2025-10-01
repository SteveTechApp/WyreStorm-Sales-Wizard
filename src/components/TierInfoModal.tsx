import React from 'react';
import InfoModal from './InfoModal';
import TierIcon from './TierIcon';

interface TierInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TierInfoModal: React.FC<TierInfoModalProps> = ({ isOpen, onClose }) => {
  return (
    <InfoModal isOpen={isOpen} onClose={onClose} title="Design Tier Guide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg bg-background-secondary/50">
                <div className="flex items-center gap-2 mb-2">
                    <TierIcon tier="Bronze" className="h-6 w-6" />
                    <h3 className="text-xl font-bold text-[#cd7f32]">Bronze</h3>
                </div>
                <p className="text-sm mb-3">Focuses on core functionality and cost-effectiveness. Ideal for budget-conscious projects or secondary spaces.</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-text-secondary">
                    <li>Reliable, essential features</li>
                    <li>Wired connectivity focus</li>
                    <li>Auto-switching or simple keypads</li>
                    <li>Standard documentation</li>
                </ul>
            </div>
            <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                    <TierIcon tier="Silver" className="h-6 w-6" />
                    <h3 className="text-xl font-bold text-text-primary">Silver (Recommended)</h3>
                </div>
                <p className="text-sm mb-3">A balance of performance and value, with enhanced features and flexibility. The most common choice for modern meeting rooms.</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-text-secondary">
                    <li>Includes Video Conferencing</li>
                    <li>USB-C & Wireless Casting</li>
                    <li>Enhanced audio options</li>
                    <li>As-built drawings included</li>
                </ul>
            </div>
            <div className="p-4 border rounded-lg bg-background-secondary/50">
                <div className="flex items-center gap-2 mb-2">
                    <TierIcon tier="Gold" className="h-6 w-6" />
                    <h3 className="text-xl font-bold text-yellow-500">Gold</h3>
                </div>
                <p className="text-sm mb-3">Prioritizes performance, scalability, and cutting-edge features for executive or high-usage spaces.</p>
                 <ul className="list-disc list-inside text-sm space-y-1 text-text-secondary">
                    <li>AVoIP / Networked AV</li>
                    <li>Advanced audio (DSP, ceiling mics)</li>
                    <li>Touch panel control</li>
                    <li>Remote management services</li>
                </ul>
            </div>
        </div>
    </InfoModal>
  );
};

export default TierInfoModal;
