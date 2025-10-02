import React, { useState, useEffect } from 'react';
import { VideoWallConfig } from '../../utils/types.ts';
import StepLayout from './videoWall/StepLayout.tsx';
import StepTechnology from './videoWall/StepTechnology.tsx';
import StepSummary from './videoWall/StepSummary.tsx';

interface VideoWallWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: VideoWallConfig) => void;
}

const STEPS = ['Layout', 'Technology', 'Summary'];

const VideoWallWizardModal: React.FC<VideoWallWizardModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<VideoWallConfig>({
      type: 'lcd',
      layout: { rows: 2, cols: 2 },
      technology: 'avoip_500e'
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-border-color">
          <h2 className="text-xl font-bold">Video Wall Configurator</h2>
          <p className="text-sm text-text-secondary">Step {currentStep + 1}: {STEPS[currentStep]}</p>
        </div>
        <div className="p-6 min-h-[300px]">
            {renderStepContent()}
        </div>
        <div className="p-4 bg-background flex justify-between border-t border-border-color">
            <button onClick={() => setCurrentStep(s => Math.max(0, s-1))} disabled={currentStep === 0} className="bg-background-secondary hover:bg-border-color font-bold py-2 px-4 rounded-lg disabled:opacity-50">Previous</button>
            {currentStep < STEPS.length - 1 
                ? <button onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s+1))} className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg">Next</button>
                : <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md">Save Configuration</button>
            }
        </div>
      </div>
    </div>
  );
};

export default VideoWallWizardModal;