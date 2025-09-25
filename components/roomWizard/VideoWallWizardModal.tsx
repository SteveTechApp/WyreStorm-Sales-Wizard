import React, { useState, useEffect } from 'react';
import { VideoWallConfig } from '../../utils/types';

interface VideoWallWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: VideoWallConfig) => void;
  initialConfig?: VideoWallConfig;
  displayType?: 'single' | 'lcd_video_wall' | 'led_video_wall';
}

const defaultLayout = { rows: 2, cols: 2 };

const VideoWallWizardModal: React.FC<VideoWallWizardModalProps> = ({ isOpen, onClose, onSave, initialConfig, displayType }) => {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<VideoWallConfig>({
      type: displayType === 'led_video_wall' ? 'led' : 'lcd',
      layout: initialConfig?.layout || defaultLayout,
      technology: initialConfig?.technology || 'processor_vw',
  });

  useEffect(() => {
      if (isOpen) {
          setConfig({
              type: displayType === 'led_video_wall' ? 'led' : 'lcd',
              layout: initialConfig?.layout || defaultLayout,
              technology: initialConfig?.technology || 'processor_vw',
          });
          setStep(0);
      }
  }, [isOpen, initialConfig, displayType]);
  
  if (!isOpen) return null;

  const handleSave = () => {
    onSave(config);
  };
  
  const totalSteps = config.type === 'lcd' ? 3 : 2;

  const renderStep = () => {
    switch (step) {
      case 0: // Layout (LCD only) or Technology (LED)
        if (config.type === 'lcd') {
            return (
                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Step 1: Wall Layout</h3>
                    <p className="text-sm text-text-secondary mb-4">Specify the grid of LCD panels for your video wall.</p>
                    <div className="flex items-center gap-4">
                        <input type="number" value={config.layout.rows} onChange={e => setConfig(c => ({...c, layout: {...c.layout, rows: parseInt(e.target.value) || 1}}))} className="w-24 p-2 border border-border-color rounded-md bg-input-bg text-center" min="1"/>
                        <span className="font-semibold">x</span>
                        <input type="number" value={config.layout.cols} onChange={e => setConfig(c => ({...c, layout: {...c.layout, cols: parseInt(e.target.value) || 1}}))} className="w-24 p-2 border border-border-color rounded-md bg-input-bg text-center" min="1"/>
                        <span className="text-text-primary">{`(${config.layout.rows * config.layout.cols} screens total)`}</span>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-sm text-yellow-300">
                        <span className="font-bold">Aspect Ratio Warning:</span> Non-standard layouts (e.g., 3x1, 5x2) may result in stretched or letterboxed content unless the source can output a custom resolution.
                    </div>
                </div>
            );
        }
        // Fallthrough for LED to Technology step
        return renderStepContent(1);
      case 1: // Technology
        return renderStepContent(config.type === 'lcd' ? 2 : 1);
      case 2: // Summary
        return renderStepContent(3);
      default:
        return null;
    }
  };

  const TechnologyOption: React.FC<{tech: VideoWallConfig['technology'], title: string, desc: string, img: string}> = ({tech, title, desc, img}) => (
      <div onClick={() => setConfig(c => ({...c, technology: tech}))} className={`p-3 border-2 rounded-lg cursor-pointer flex gap-3 ${config.technology === tech ? 'border-primary bg-primary/10' : 'border-border-color hover:border-primary/50'}`}>
          <img src={img} alt={title} className="w-24 h-24 object-contain rounded-md bg-black/20 flex-shrink-0" />
          <div>
              <h4 className="font-bold text-text-primary">{title}</h4>
              <p className="text-xs text-text-secondary">{desc}</p>
          </div>
      </div>
  );

  const renderStepContent = (stepNumber: number) => {
    switch (stepNumber) {
        case 1: // LED technology (same as LCD technology but it's the first step)
        case 2: // LCD technology
            return (
                <div>
                     <h3 className="text-lg font-semibold text-text-primary mb-2">Step {stepNumber}: Technology</h3>
                     <p className="text-sm text-text-secondary mb-4">How will the video signal be processed and distributed to the displays?</p>
                     <div className="space-y-3">
                         <TechnologyOption tech="processor_vw" title="Dedicated Processor" desc="A single box (e.g., SW-0204-VW) splits one source across the screens. Simple, reliable, but limited to one source for the whole wall." img="https://storage.googleapis.com/wyrestorm-wingman-assets/training/videowall_tech_processor.png" />
                         <TechnologyOption tech="avoip_500e" title="AVoIP (Recommended)" desc="Each screen gets a decoder (e.g., NHD-500-E-RX). Extremely flexible, allows any source to be routed to the wall. The modern standard." img="https://storage.googleapis.com/wyrestorm-wingman-assets/training/videowall_tech_avoip.png" />
                         <TechnologyOption tech="looped" title="Looped / Daisy-Chain" desc="The source is connected to the first screen, which then passes the signal to the next. Relies on display hardware, can be less reliable and flexible." img="https://storage.googleapis.com/wyrestorm-wingman-assets/training/videowall_tech_looped.png" />
                     </div>
                </div>
            )
        case 3: // Summary
             return (
                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Step 3: Summary</h3>
                    <p className="text-sm text-text-secondary mb-4">Please confirm your video wall configuration.</p>
                    <div className="space-y-2 p-3 bg-background rounded-md border border-border-color">
                        <p><strong>Wall Type:</strong> <span className="capitalize">{config.type}</span></p>
                        {config.type === 'lcd' && <p><strong>Layout:</strong> {config.layout.rows} rows x {config.layout.cols} columns ({config.layout.rows * config.layout.cols} screens)</p>}
                        <p><strong>Technology:</strong> <span className="capitalize">{config.technology.replace(/_/g, ' ')}</span></p>
                    </div>
                </div>
            )
        default:
            return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] animate-fade-in-fast" onClick={onClose}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-2xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border-color">
            <h2 className="text-2xl font-bold text-text-primary">Video Wall Wizard</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 min-h-[300px]">
            {renderStep()}
        </div>
        <div className="flex justify-between items-center p-4 border-t border-border-color">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md disabled:opacity-50">
                Back
            </button>
            {step < totalSteps - 1 ? (
                <button onClick={() => setStep(s => s + 1)} className="bg-primary hover:bg-secondary text-text-on-accent font-bold py-2 px-6 rounded-md">
                    Next
                </button>
            ) : (
                <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-6 rounded-md">
                    Save Configuration
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default VideoWallWizardModal;