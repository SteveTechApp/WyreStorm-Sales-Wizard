import React from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { RoomWizardAnswers } from '../../utils/types.ts';
import {
    WALL_CONSTRUCTION_OPTIONS,
    CONTAINMENT_OPTIONS,
    AUDIO_SPEAKER_LAYOUT_OPTIONS,
    AUDIO_SYSTEM_TYPE_OPTIONS,
    AUDIO_USE_CASE_OPTIONS,
// FIX: Add file extension to satisfy module resolution for constants.ts
} from '../../data/constants.ts';

interface StepProps {
    answers: RoomWizardAnswers;
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
}

const StepEnvironment: React.FC<StepProps> = ({ answers, setAnswers }) => {
    
    const handleConstructionChange = (field: keyof typeof answers.constructionDetails, value: string) => {
        setAnswers(prev => ({ ...prev, constructionDetails: { ...prev.constructionDetails, [field]: value as any } }));
    };

    const handleAudioDetailsChange = (field: keyof typeof answers.audioSystemDetails, value: string) => {
        setAnswers(prev => ({ ...prev, audioSystemDetails: { ...prev.audioSystemDetails, [field]: value as any } }));
    };
    
    const handleAudioUseCaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setAnswers(prev => {
            const currentUseCases = prev.audioSystemDetails.useCases || [];
            // FIX: Cast the incoming string `value` to the expected literal union type.
            // This ensures that when we add it to the array, the array's type remains
            // `('speech_reinforcement' | ... )[]` instead of becoming a generic `string[]`.
            const newUseCases = checked 
                ? [...currentUseCases, value as (typeof currentUseCases)[number]] 
                : currentUseCases.filter(c => c !== value);
            return { ...prev, audioSystemDetails: { ...prev.audioSystemDetails, useCases: newUseCases } };
        });
    };
    
    return (
        <section className="animate-fade-in-fast space-y-6">
            <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-3">Construction Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Wall Construction</label>
                        <select value={answers.constructionDetails.wallConstruction} onChange={(e) => handleConstructionChange('wallConstruction', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                            {WALL_CONSTRUCTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cable Containment</label>
                        <select value={answers.constructionDetails.cableContainment} onChange={(e) => handleConstructionChange('cableContainment', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                            {CONTAINMENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-3">Audio System</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Speaker Layout</label>
                        <select value={answers.audioSystemDetails.speakerLayout} onChange={(e) => handleAudioDetailsChange('speakerLayout', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                            {AUDIO_SPEAKER_LAYOUT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">System Type</label>
                        <select value={answers.audioSystemDetails.systemType} onChange={(e) => handleAudioDetailsChange('systemType', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                            {AUDIO_SYSTEM_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audio Use Cases</label>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {AUDIO_USE_CASE_OPTIONS.map(opt => (
                            <label key={opt.value} className="flex items-center space-x-2 text-sm">
                                <input type="checkbox" value={opt.value} checked={(answers.audioSystemDetails.useCases || []).includes(opt.value as any)} onChange={handleAudioUseCaseChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] border-gray-300" />
                                <span>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StepEnvironment;