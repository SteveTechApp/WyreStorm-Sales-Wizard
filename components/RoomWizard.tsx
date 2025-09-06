import React, { useState } from 'react';
import { RoomWizardAnswers, SuggestedConfiguration } from '../types';
import { PRIMARY_USE_OPTIONS, DESIGN_TIER_OPTIONS } from '../constants';
import { suggestRoomConfiguration } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface RoomWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, roomType: string, designTier: string) => void;
}

const RoomWizard: React.FC<RoomWizardProps> = ({ isOpen, onClose, onAdd }) => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<RoomWizardAnswers>({
        roomName: '',
        primaryUse: PRIMARY_USE_OPTIONS[0],
        participantCount: '1-4',
        displayCount: 1,
        needsWirelessPresentation: true,
        needsBYOM: false,
        needsKVM: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<SuggestedConfiguration | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setAnswers(prev => ({ ...prev, [name]: checked }));
        } else {
            setAnswers(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) : value }));
        }
    };
    
    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => {
      setSuggestion(null);
      setStep(s => s - 1);
    };

    const handleGetSuggestion = async () => {
        setStep(3);
        setIsLoading(true);
        setSuggestion(null);
        try {
            const result = await suggestRoomConfiguration(answers);
            setSuggestion(result);
        } catch (error) {
            console.error("Failed to get room suggestion:", error);
            // Fallback in case of error
            setSuggestion({ roomType: 'Conference Room', designTier: 'Silver', reasoning: 'Could not get AI suggestion, using default.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddRoom = (tier?: string) => {
        if (!suggestion) return;
        const finalTier = tier || suggestion.designTier;
        onAdd(answers.roomName || `${suggestion.roomType} Room`, suggestion.roomType, finalTier);
        // Reset state for next time
        setStep(1);
        setSuggestion(null);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Room Basics</h3>
                        <p className="text-sm text-gray-500 mb-4">Let's start with the high-level details of the space.</p>
                        <div>
                            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">Room Name</label>
                            <input type="text" name="roomName" id="roomName" value={answers.roomName} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., The Innovation Hub" required/>
                        </div>
                        <div>
                            <label htmlFor="primaryUse" className="block text-sm font-medium text-gray-700">Primary Purpose</label>
                            <select name="primaryUse" id="primaryUse" value={answers.primaryUse} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                                {PRIMARY_USE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="participantCount" className="block text-sm font-medium text-gray-700">Typical Number of Participants</label>
                             <select name="participantCount" id="participantCount" value={answers.participantCount} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                                <option value="1-4">1-4 People (Huddle)</option>
                                <option value="5-12">5-12 People (Standard)</option>
                                <option value="13-20">13-20 People (Large)</option>
                                <option value="20+">20+ People (Extra Large)</option>
                            </select>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                         <h3 className="text-xl font-bold text-gray-800 mb-2">Key Features</h3>
                        <p className="text-sm text-gray-500 mb-4">Now, tell us about the required technology and connectivity.</p>
                        <div>
                            <label htmlFor="displayCount" className="block text-sm font-medium text-gray-700">How many primary displays will be in the room?</label>
                            <input type="number" name="displayCount" id="displayCount" min="1" max="16" value={answers.displayCount} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="space-y-3 pt-2">
                             <label className="flex items-start space-x-3 text-sm"><input type="checkbox" name="needsWirelessPresentation" checked={answers.needsWirelessPresentation} onChange={handleChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] mt-0.5 flex-shrink-0"/><div><strong className="font-semibold text-gray-800">Wireless Presentation (BYOD)</strong><span className="text-gray-600 block">Allow users to share content from their devices wirelessly.</span></div></label>
                             <label className="flex items-start space-x-3 text-sm"><input type="checkbox" name="needsBYOM" checked={answers.needsBYOM} onChange={handleChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] mt-0.5 flex-shrink-0"/><div><strong className="font-semibold text-gray-800">Bring Your Own Meeting (BYOM)</strong><span className="text-gray-600 block">Allow users to connect their laptop to use the room's camera and mics.</span></div></label>
                             <label className="flex items-start space-x-3 text-sm"><input type="checkbox" name="needsKVM" checked={answers.needsKVM} onChange={handleChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] mt-0.5 flex-shrink-0"/><div><strong className="font-semibold text-gray-800">KVM Control</strong><span className="text-gray-600 block">Allow control of a remote PC (e.g., in a rack) from the meeting table.</span></div></label>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">AI Recommendation</h3>
                        {isLoading && <LoadingSpinner message="Analyzing your needs..." />}
                        {suggestion && !isLoading && (
                            <div className="animate-fade-in bg-green-50 border border-green-200 p-4 rounded-lg">
                                <p className="text-gray-600">Based on your requirements, we suggest a:</p>
                                <p className="text-2xl font-bold text-[#008A3A] my-2">{suggestion.designTier} Tier {suggestion.roomType}</p>
                                <p className="text-sm text-gray-500 italic">"{suggestion.reasoning}"</p>
                            </div>
                        )}
                         {!isLoading && suggestion && (
                            <div className="mt-6 space-y-3">
                                <p className="text-sm text-gray-600">Would you like to add this room to your project?</p>
                                <button
                                    onClick={() => handleAddRoom()}
                                    className="w-full bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                                >
                                    Yes, Add This Room
                                </button>
                                <div className="flex items-center gap-2">
                                    <hr className="flex-grow"/>
                                    <span className="text-xs text-gray-400">OR</span>
                                    <hr className="flex-grow"/>
                                </div>
                                <p className="text-sm text-gray-600">Choose a different starting point:</p>
                                <div className="flex justify-center gap-2">
                                    {DESIGN_TIER_OPTIONS.filter(t => t !== suggestion.designTier).map(tier => (
                                        <button key={tier} onClick={() => handleAddRoom(tier)} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-md transition-colors">Add as {tier} Tier</button>
                                    ))}
                                </div>
                            </div>
                         )}
                    </div>
                );
        }
    };
    
    const getProgress = () => {
        if (step === 3 && isLoading) return 66;
        if (step === 3 && !isLoading) return 100;
        return (step - 1) * 50;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Room Wizard</h2>
                     <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
                        <div className="bg-[#008A3A] h-1.5 rounded-full transition-all duration-500" style={{ width: `${getProgress()}%`}}></div>
                    </div>
                    <div className="min-h-[300px]">
                        {renderStep()}
                    </div>
                </div>
                <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg">
                    <button type="button" onClick={step === 1 ? onClose : handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    {step < 2 && (
                        <button type="button" onClick={handleNext} disabled={!answers.roomName} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400">Next</button>
                    )}
                    {step === 2 && (
                         <button type="button" onClick={handleGetSuggestion} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">Get Suggestion</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomWizard;