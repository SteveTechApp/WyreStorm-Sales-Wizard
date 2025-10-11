import React from 'react';
import { VideoWallConfig } from '../../../utils/types.ts';

interface StepTechnologyProps {
  config: VideoWallConfig;
  updateConfig: (newConfig: Partial<VideoWallConfig>) => void;
}

const TECHNOLOGY_OPTIONS = [
    { id: 'processor_vw', name: 'Dedicated Video Wall Processor', description: 'A single hardware box that splits a source across multiple screens. Simple and reliable for single-source walls.' },
    { id: 'avoip_150', name: 'AVoIP (Multi-view)', description: 'Uses specialized NetworkHD 150 decoders to create flexible multi-source layouts on the wall.' },
    { id: 'avoip_500e', name: 'AVoIP (Standard)', description: 'Uses one NetworkHD 500-E decoder per screen. Good for showing single sources on single screens or across the whole wall.' },
    { id: 'avoip_600', name: 'AVoIP (10G Uncompressed)', description: 'The highest quality, zero-latency option using NetworkHD 600 series. For mission-critical applications.' }
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
