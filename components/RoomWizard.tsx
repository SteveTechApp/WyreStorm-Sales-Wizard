

import React, { useState, useEffect, useMemo } from 'react';
// FIX: Corrected import path for types
import { RoomWizardAnswers, SolutionVisualization, DisplayConfiguration, SuggestedConfiguration, RoomData } from '../types';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS, COMMON_FEATURES, ROOM_SPECIFIC_FEATURES, PRIMARY_USE_OPTIONS, DISPLAY_TYPE_OPTIONS } from '../constants';
import { visualizeSolution, suggestRoomConfiguration } from '../services/geminiService';
import SolutionVisualizerModal from './SolutionVisualizerModal';
import LoadingSpinner from './LoadingSpinner';

interface RoomWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (answers: RoomWizardAnswers, roomType: string, designTier: string) => void;
  initialData?: RoomData | null;
}

const RoomWizard: React.FC<RoomWizardProps> = ({ isOpen, onClose, onAdd, initialData }) => {
  const [step, setStep] = useState(1);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestedConfiguration | null>(null);
  
  // Form state
  const [roomName, setRoomName] = useState('');
  const [participantCount, setParticipantCount] = useState(10);
  const [primaryUse, setPrimaryUse] = useState(PRIMARY_USE_OPTIONS[0]);
  const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
  const [designTier, setDesignTier] = useState(DESIGN_TIER_OPTIONS[1]);
  const [features, setFeatures] = useState<string[]>([]);
  const [displayConfiguration, setDisplayConfiguration] = useState<DisplayConfiguration[]>([{ type: DISPLAY_TYPE_OPTIONS[0].id, quantity: 1 }]);
  
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizerData, setVisualizerData] = useState<SolutionVisualization | null>(null);

  const availableFeatures = useMemo(() => {
    const specific = ROOM_SPECIFIC_FEATURES[roomType] || [];
    return [...new Set([...COMMON_FEATURES, ...specific, ...features])].sort();
  }, [roomType, features]);

  useEffect(() => {
    if (isOpen) {
      setSuggestion(null);
      setIsSuggesting(false);
      
      if (initialData) {
        // Pre-populate Step 1 with existing data for a configuration run
        setRoomName(initialData.roomName);
        setParticipantCount(initialData.maxParticipants);
        setPrimaryUse(initialData.primaryUse || PRIMARY_USE_OPTIONS[0]);
        setRoomType(initialData.roomType);

        // If it's a fully configured room, we can pre-populate Step 3 and jump there.
        // Otherwise, we start at Step 1 to get suggestions for the placeholder.
        if (initialData.functionalityStatement) {
            setDesignTier(initialData.designTier || DESIGN_TIER_OPTIONS[1]);
            setFeatures(initialData.features);
            setDisplayConfiguration([{ type: DISPLAY_TYPE_OPTIONS[0].id, quantity: initialData.maxDisplays || 1 }]);
            setStep(3);
        } else {
            setStep(1);
        }
      } else {
        // This case is for creating a new room from scratch
        setStep(1);
        setRoomName('');
        setParticipantCount(10);
        setPrimaryUse(PRIMARY_USE_OPTIONS[0]);
        setRoomType(ROOM_TYPES[0]);
        setDesignTier(DESIGN_TIER_OPTIONS[1]);
        setFeatures([]);
        setDisplayConfiguration([{ type: DISPLAY_TYPE_OPTIONS[0].id, quantity: 1 }]);
      }
    }
  }, [isOpen, initialData]);


  const handleGetSuggestion = async () => {
    setIsSuggesting(true);
    setStep(2);
    try {
        const result = await suggestRoomConfiguration({ participantCount, primaryUse, roomType });
        setSuggestion(result);
    } catch (e) {
        console.error("Failed to get suggestion:", e);
        setStep(1); // Go back to step 1 on error
    } finally {
        setIsSuggesting(false);
    }
  };
  
  const handleAcceptSuggestion = () => {
    if (!suggestion) return;
    setRoomType(suggestion.roomType);
    setDesignTier(suggestion.designTier);
    setFeatures(suggestion.features);
    const suggestedDisplays = suggestion.displayConfiguration.map(d => ({
        ...d,
        type: DISPLAY_TYPE_OPTIONS.find(opt => opt.label === d.type)?.id || d.type
    }));
    setDisplayConfiguration(suggestedDisplays);
    setStep(3);
  };

  const handleConfigureManually = () => {
    if (initialData) {
        setRoomType(initialData.roomType); // Keep the placeholder's room type
    }
    setDesignTier(DESIGN_TIER_OPTIONS[1]);
    setFeatures([]);
    setDisplayConfiguration([{ type: DISPLAY_TYPE_OPTIONS[0].id, quantity: 1 }]);
    setSuggestion(null); // Clear suggestion so summary doesn't show
    setStep(3);
  };


  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFeatures(prev => checked ? [...prev, value] : prev.filter(f => f !== value));
  };

  const handleDisplayChange = (index: number, field: keyof DisplayConfiguration, value: string | number) => {
    const newConfig = [...displayConfiguration];
    (newConfig[index] as any)[field] = value;
    setDisplayConfiguration(newConfig);
  };

  const addDisplay = () => {
    setDisplayConfiguration([...displayConfiguration, { type: DISPLAY_TYPE_OPTIONS[0].id, quantity: 1 }]);
  };

  const removeDisplay = (index: number) => {
    if (displayConfiguration.length > 1) {
        setDisplayConfiguration(displayConfiguration.filter((_, i) => i !== index));
    }
  };
  
  const handleVisualize = async () => {
      setIsVisualizerOpen(true);
      setIsVisualizing(true);
      try {
          const data = await visualizeSolution(roomType, designTier);
          setVisualizerData(data);
      } catch (error) {
          console.error("Failed to visualize solution:", error);
          setVisualizerData(null);
      } finally {
          setIsVisualizing(false);
      }
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Map display IDs back to labels for the final answers object
    const finalDisplayConfig = displayConfiguration.map(d => ({
        ...d,
        type: DISPLAY_TYPE_OPTIONS.find(opt => opt.id === d.type)?.label || d.type
    }));
    const answers: RoomWizardAnswers = { roomName, participantCount, primaryUse, displayConfiguration: finalDisplayConfig, features };
    onAdd(answers, roomType, designTier);
  };
  
  const submitButtonText = initialData ? 'Save Configuration' : 'Add Room to Project';

  const renderStep1 = () => {
    const wizardTitle = initialData ? `Step 1: Describe Needs for '${initialData.roomName}'` : 'Step 1: Define Your New Room';
    return (
     <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-700">{wizardTitle}</h3>
        <p className="text-sm text-gray-500 -mt-4">Provide basic details, and our AI will suggest a complete configuration for you to refine.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialData ? (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                        <div className="w-full p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700 font-medium cursor-not-allowed">{roomType}</div>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                        <input id="roomName" type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="e.g., Main Conference Room" className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                        <select id="roomType" value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                            {ROOM_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </>
            )}
            <div>
                <label htmlFor="participantCount" className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input id="participantCount" type="number" min="1" value={participantCount} onChange={(e) => setParticipantCount(Math.max(1, Number(e.target.value)))} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
        </div>
         <div>
            <label htmlFor="primaryUse" className="block text-sm font-medium text-gray-700 mb-1">Primary Use Case</label>
            <select id="primaryUse" value={primaryUse} onChange={(e) => setPrimaryUse(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                {PRIMARY_USE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
     </div>
    );
  };

  const renderStep2 = () => {
    if (isSuggesting) {
        return <div className="min-h-[250px] flex items-center justify-center"><LoadingSpinner message="Generating AI Configuration..." /></div>;
    }

    if (suggestion) {
        return (
            <div className="animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-700">Step 2: Review AI Suggestion</h3>
                <p className="text-sm text-gray-500 mb-4">The AI has generated a starting point. Accept this to fine-tune it, or configure the room manually.</p>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                    <p><strong className="font-semibold text-gray-700 w-48 inline-block">Suggested Room Type:</strong> {suggestion.roomType}</p>
                    <p><strong className="font-semibold text-gray-700 w-48 inline-block">Suggested Design Tier:</strong> {suggestion.designTier}</p>
                    <p className="text-sm text-blue-800 italic pt-2 border-t mt-2">{suggestion.summary}</p>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={handleConfigureManually} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">
                        Configure Manually
                    </button>
                    <button onClick={handleAcceptSuggestion} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">
                        Accept & Continue
                    </button>
                </div>
            </div>
        );
    }
    return null;
  };

  const renderStep3 = () => (
    <div className="animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-700">Step 3: Configure '{roomName}'</h3>
        <p className="text-sm text-gray-500 -mt-1 mb-4">Adjust the details for your new room below.</p>

        {suggestion && (
            <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-800 text-sm mb-1">AI Recommendation Baseline</h4>
                <p className="text-xs text-blue-700">{suggestion.summary}</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[55vh] overflow-y-auto pr-3">
             {/* Row 1 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" readOnly/>
                 <p className="text-xs text-gray-500 mt-1">{initialData ? 'Room name is set during project setup.' : 'Room name is defined in Step 1.'}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Design Tier</label>
                <div className="flex flex-wrap gap-2">
                     {DESIGN_TIER_OPTIONS.map(tier => (
                        <label key={tier} className="cursor-pointer">
                            <input type="radio" name="designTier" value={tier} checked={designTier === tier} onChange={() => setDesignTier(tier)} className="sr-only peer" />
                            <div className="px-3 py-2 border rounded-md text-sm font-medium transition-colors bg-white text-gray-700 border-gray-300 peer-checked:bg-[#008A3A] peer-checked:text-white peer-checked:border-[#008A3A]">{tier}</div>
                        </label>
                    ))}
                </div>
                 <button type="button" onClick={handleVisualize} className="text-xs text-blue-600 hover:underline mt-1">What does this tier mean? Visualize it!</button>
            </div>
            
            {/* Row 2 - Displays */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Configuration</label>
                <div className="space-y-2 p-3 border rounded-md bg-gray-50/50">
                    {displayConfiguration.map((config, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <select value={config.type} onChange={e => handleDisplayChange(index, 'type', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                                {DISPLAY_TYPE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                             <input type="number" value={config.quantity} min="1" onChange={e => handleDisplayChange(index, 'quantity', Math.max(1, Number(e.target.value)))} className="w-24 p-2 border border-gray-300 rounded-md" />
                            <button type="button" onClick={() => removeDisplay(index)} className="text-red-500 hover:text-red-700 text-xs p-1 font-bold disabled:opacity-50" disabled={displayConfiguration.length <= 1}>&#10005;</button>
                        </div>
                    ))}
                    <button type="button" onClick={addDisplay} className="text-xs text-[#008A3A] hover:underline font-medium">+ Add Display Type</button>
                </div>
            </div>
            
             {/* Row 3 - Features */}
            <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-md bg-gray-50/50">
                    {availableFeatures.map(feature => (
                    <label key={feature} className="flex items-center space-x-2 text-sm p-1 rounded hover:bg-gray-100">
                        <input type="checkbox" value={feature} checked={features.includes(feature)} onChange={handleFeatureChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] border-gray-300" />
                        <span>{feature}</span>
                    </label>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <>
    <SolutionVisualizerModal 
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        isLoading={isVisualizing}
        data={visualizerData}
        roomType={roomType}
        designTier={designTier}
    />
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Room Wizard</h2>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="mt-8 flex justify-between items-center">
            <div>
                 {step === 2 && !isSuggesting && <button onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">Back</button>}
                 {step === 3 && <button onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">Restart with AI</button>}
            </div>
            <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="text-gray-600 font-medium py-2 px-4 rounded-md mr-2">Cancel</button>
                {step === 1 && <button onClick={handleGetSuggestion} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">Get AI Suggestion</button>}
                {step === 3 && <button onClick={handleSubmit} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">{submitButtonText}</button>}
            </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default RoomWizard;
