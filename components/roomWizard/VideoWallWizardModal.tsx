import React, { useState } from 'react';
import { VideoWallConfig } from '../../utils/types.ts';
import StepLayout from './videoWall/StepLayout.tsx';
import StepTechnology from './videoWall/StepTechnology.tsx';
import StepSummary from './videoWall/StepSummary.tsx';
import InfoModal from '../InfoModal.tsx';

const STEPS = ['Layout', 'Technology', 'Summary'];

const VideoWallWizardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: VideoWallConfig) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<VideoWallConfig>({
      type: 'lcd',
      layout: { rows: 2, cols: 2 },
      technology: 'avoip_500'
  });

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const updateConfig = (newConfig: Partial<VideoWallConfig>) => {
    setConfig(prev => ({...prev, ...newConfig}));
  };

  const renderStepContent = () => {
      switch(currentStep) {
          case 0: return <StepLayout config={config} updateConfig={updateConfig} />;
          case 1: return <StepTechnology config={config} updateConfig={updateConfig} />;
          case 2: return <StepSummary config={config} />;
          default: return null;
      }
  }

  const title = (
    <div>
      <h2 className="text-xl font-bold text-text-primary">Video Wall Configurator</h2>
      <p className="text-sm text-text-secondary">Step {currentStep + 1}: {STEPS[currentStep]}</p>
    </div>
  );

  const footer = (
    <div className="flex justify-between w-full">
        <button onClick={() => setCurrentStep(s => Math.max(0, s-1))} disabled={currentStep === 0} className="bg-background-secondary hover:bg-border-color font-bold py-2 px-4 rounded-lg disabled:opacity-50">Previous</button>
        {currentStep < STEPS.length - 1 
            ? <button onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s+1))} className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg">Next</button>
            : <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md">Save Configuration</button>
        }
    </div>
  );

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-2xl" title={title} footer={footer}>
      <div className="min-h-[300px]">
          {renderStepContent()}
      </div>
    </InfoModal>
  );
};

export default VideoWallWizardModal;