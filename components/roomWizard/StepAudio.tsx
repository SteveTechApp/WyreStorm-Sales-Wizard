import React, { useState } from 'react';
import { RoomWizardAnswers } from '../../utils/types.ts';
import { 
    AUDIO_SPEAKER_LAYOUT_OPTIONS, 
    AUDIO_SYSTEM_TYPE_OPTIONS, 
    AUDIO_USE_CASE_OPTIONS,
    MICROPHONE_TYPES
} from '../../data/wizardOptions.ts';
import AudioDesignGuideModal from '../AudioDesignGuideModal.tsx';
import ToggleSwitch from '../ui/ToggleSwitch.tsx';

interface StepAudioProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepAudio: React.FC<StepAudioProps> = ({ answers, updateAnswers }) => {
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const handleAudioDetailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateAnswers({ audioSystemDetails: { ...answers.audioSystemDetails, [name]: value } });
    };
    
    const handleUseCaseChange = (useCase: string, checked: boolean) => {
        let newUseCases = [...answers.audioSystemDetails.useCases];
        if (checked) {
            newUseCases.push(useCase as any);
        } else {
            newUseCases = newUseCases.filter(uc => uc !== useCase);
        }
        updateAnswers({ audioSystemDetails: { ...answers.audioSystemDetails, useCases: newUseCases } });
    };

    const handleUcCompatChange = (checked: boolean) => {
        updateAnswers({ audioSystemDetails: { ...answers.audioSystemDetails, ucCompatibility: checked } });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Audio System</h2>
                <button type="button" onClick={() => setIsGuideOpen(true)} className="text-sm font-medium text-accent hover:underline">
                    Audio Design Guide
                </button>
            </div>
            <p className="text-text-secondary mb-6">Specify the audio requirements for speech, program audio, and conferencing.</p>
            
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="speaker-layout" className="block text-sm font-medium text-text-secondary">Speaker Layout</label>
                        <select id="speaker-layout" name="speakerLayout" value={answers.audioSystemDetails.speakerLayout} onChange={handleAudioDetailChange} className="w-full p-2 border rounded-md bg-input-bg mt-1">
                            {AUDIO_SPEAKER_LAYOUT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="system-type" className="block text-sm font-medium text-text-secondary">System Type</label>
                        <select id="system-type" name="systemType" value={answers.audioSystemDetails.systemType} onChange={handleAudioDetailChange} className="w-full p-2 border rounded-md bg-input-bg mt-1">
                            {AUDIO_SYSTEM_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Primary Audio Use Cases</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {AUDIO_USE_CASE_OPTIONS.map(opt => (
                            <div key={opt.value} className="flex items-center p-2 bg-background rounded-md border">
                                <input
                                    type="checkbox"
                                    id={`use-case-${opt.value}`}
                                    checked={answers.audioSystemDetails.useCases.includes(opt.value as any)}
                                    onChange={(e) => handleUseCaseChange(opt.value, e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                                />
                                <label htmlFor={`use-case-${opt.value}`} className="ml-2 text-sm">{opt.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <label htmlFor="microphone-type" className="block text-sm font-medium text-text-secondary">Microphone Type</label>
                    <select id="microphone-type" name="microphoneType" value={answers.audioSystemDetails.microphoneType} onChange={handleAudioDetailChange} className="w-full p-2 border rounded-md bg-input-bg mt-1">
                        {MICROPHONE_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                 <div className="flex items-center justify-between p-3 bg-background rounded-md border border-border-color">
                    <div>
                        <label className="text-sm font-medium">UC Compatibility Required</label>
                        <p className="text-xs text-text-secondary">Does the audio system need to integrate with a BYOM/UC system?</p>
                    </div>
                    <ToggleSwitch
                        checked={answers.audioSystemDetails.ucCompatibility}
                        onChange={handleUcCompatChange}
                    />
                </div>
            </div>
            <AudioDesignGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </div>
    );
};

export default StepAudio;
