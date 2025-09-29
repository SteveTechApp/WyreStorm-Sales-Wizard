import React from 'react';
import { VideoWallConfig } from '../../../utils/types';

interface StepTechnologyProps {
  config: VideoWallConfig;
  updateConfig: (newConfig: Partial<VideoWallConfig>) => void;
}

const TECH_OPTIONS: {id: VideoWallConfig['technology'], name: string, desc: string}[] = [
    { id: 'avoip_500e', name: 'NetworkHD 500 Series (AVoIP)', desc: 'Most flexible. Visually lossless quality. Ideal for corporate and command center walls.'},
    { id: 'processor_vw', name: 'Standalone Processor', desc: 'Simple and robust for single-source walls. Limited flexibility.'},
    { id: 'multiview_150', name: 'NetworkHD 150 Series (Multiview)', desc: 'AVoIP solution that allows multiple sources to be shown on the wall at once.'},
];

const StepTechnology: React.FC<StepTechnologyProps> = ({ config, updateConfig }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Select Video Wall Technology</h2>
      {TECH_OPTIONS.map(opt => (
          <button 
            key={opt.id}
            onClick={() => updateConfig({ technology: opt.id })}
            className={`w-full text-left p-4 border-2 rounded-lg ${config.technology === opt.id ? 'border-accent bg-accent/10' : 'border-border-color hover:border-accent/50'}`}
          >
              <h4 className="font-bold">{opt.name}</h4>
              <p className="text-sm text-text-secondary">{opt.desc}</p>
          </button>
      ))}
    </div>
  );
};

export default StepTechnology;
