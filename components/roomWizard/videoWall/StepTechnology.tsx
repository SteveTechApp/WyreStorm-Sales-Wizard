import React from 'react';
import { VideoWallConfig } from '../../../utils/types.ts';

interface StepTechnologyProps {
  config: VideoWallConfig;
  updateConfig: (newConfig: Partial<VideoWallConfig>) => void;
}

const TECHNOLOGY_OPTIONS = [
    { 
        id: 'processor_sw0204vw', 
        name: 'Dedicated Processor (SW-0204-VW)', 
        description: 'A 4-output processor for 2x2 or 1x4 walls. Simple and reliable for single-source walls.' 
    },
    { 
        id: 'processor_sw0206vw', 
        name: 'Dedicated Processor (SW-0206-VW)', 
        description: 'A 6-output processor for larger custom layouts (e.g., 2x3 or 1x6). Simple and reliable for single-source walls.' 
    },
    { 
        id: 'avoip_150', 
        name: 'AVoIP (100/120 Series + NHD-150-RX)', 
        description: 'Uses specialized NHD-150-RX multiview decoders with the low-bandwidth 100/120 Series to create flexible, multi-source video walls.' 
    },
    { 
        id: 'avoip_500', 
        name: 'AVoIP (500 Series)', 
        description: 'Uses one NHD-500-RX decoder per screen. A high-quality, low-latency 1GbE solution with bezel correction and KVM.' 
    },
    { 
        id: 'avoip_600', 
        name: 'AVoIP (600 Series 10G)', 
        description: 'The highest quality, zero-latency option using NetworkHD 600 series transceivers. For mission-critical applications.' 
    }
];

const StepTechnology: React.FC<StepTechnologyProps> = ({ config, updateConfig }) => {
  return (
    <div>
        <h2 className="text-xl font-bold mb-4">Select Technology</h2>
        <div className="space-y-3">
            {TECHNOLOGY_OPTIONS.map(opt => (
                <button 
                    key={opt.id}
                    onClick={() => updateConfig({ technology: opt.id as VideoWallConfig['technology'] })}
                    className={`w-full text-left p-3 border-2 rounded-lg transition-colors ${config.technology === opt.id ? 'border-accent bg-accent/10' : 'border-border-color hover:border-accent/50'}`}
                >
                    <p className="font-bold">{opt.name}</p>
                    <p className="text-sm text-text-secondary">{opt.description}</p>
                </button>
            ))}
        </div>
    </div>
  );
};

export default StepTechnology;