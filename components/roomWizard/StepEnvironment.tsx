import React, { useState } from 'react';
import { RoomWizardAnswers } from '../../utils/types.ts';
import {
  WALL_CONSTRUCTION_OPTIONS,
  CONTAINMENT_OPTIONS,
  AUDIO_SPEAKER_LAYOUT_OPTIONS,
  AUDIO_SYSTEM_TYPE_OPTIONS,
  AUDIO_USE_CASE_OPTIONS,
} from '../../data/wizardOptions.ts';
import AudioDesignGuideModal from '../AudioDesignGuideModal.tsx';

interface StepEnvironmentProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepEnvironment: React.FC<StepEnvironmentProps> = ({ answers, updateAnswers }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleConstructionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateAnswers({ constructionDetails: { ...answers.constructionDetails, [name]: value } });
  };
  
  const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    updateAnswers({ audioSystemDetails: { ...answers.audioSystemDetails, [name]: value } });
  };

  const handleUseCaseChange = (useCase: ('speech_reinforcement' | 'program_audio' | 'video_conferencing')) => {
    const currentUseCases = answers.audioSystemDetails.useCases;
    const newUseCases = currentUseCases.includes(useCase)
        ? currentUseCases.filter(uc => uc !== useCase)
        : [...currentUseCases, useCase];
    
    updateAnswers({ 
        audioSystemDetails: { 
            ...answers.audioSystemDetails, 
            useCases: newUseCases 
        } 
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Room Environment</h2>
      <p className="text-text-secondary mb-6">Provide details about the physical construction and audio requirements of the room.</p>
      
      <div className="space-y-8">
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-4">Construction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="wall-construction" className="block text-sm font-medium text-text-secondary">Wall Construction</label>
              <select id="wall-construction" name="wallConstruction" value={answers.constructionDetails.wallConstruction} onChange={handleConstructionChange} className="w-full p-2 border rounded-md bg-input-bg mt-1">
                {WALL_CONSTRUCTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="cable-containment" className="block text-sm font-medium text-text-secondary">Cable Containment</label>
              <select id="cable-containment" name="cableContainment" value={answers.constructionDetails.cableContainment} onChange={handleConstructionChange} className="w-full p-2 border rounded-md bg-input-bg mt-1">
                {CONTAINMENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Audio System</h3>
            <button type="button" onClick={() => setIsGuideOpen(true)} className="text-sm font-medium text-accent hover:underline">
                Audio Design Guide
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="speaker-layout" className="block text-sm font-medium text-text-secondary">Speaker Layout</label>
              <select id="speaker-layout" name="speakerLayout" value={answers.audioSystemDetails.speakerLayout} onChange={handleAudioChange} className="w-full p-2 border rounded-md bg-input-bg mt-1">
                {AUDIO_SPEAKER_LAYOUT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="audio-system-type" className="block text-sm font-medium text-text-secondary">System Type</label>
              <select id="audio-system-type" name="systemType" value={answers.audioSystemDetails.systemType} onChange={handleAudioChange} className="w-full p-2 border rounded-md bg-input-bg mt-1">
                {AUDIO_SYSTEM_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
           <div className="mt-6">
            <label className="block text-sm font-medium text-text-secondary">Audio Use Cases (select multiple)</label>
            <div className="flex flex-wrap gap-2 mt-2">
                {AUDIO_USE_CASE_OPTIONS.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleUseCaseChange(opt.value as any)}
                    className={`px-3 py-1.5 text-sm rounded-md border ${
                    answers.audioSystemDetails.useCases.includes(opt.value as any)
                        ? 'bg-accent/10 border-accent text-accent'
                        : 'bg-background hover:bg-border-color border-border-color'
                    }`}
                >
                    {opt.label}
                </button>
                ))}
            </div>
           </div>
        </div>
      </div>
      <AudioDesignGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default StepEnvironment;
