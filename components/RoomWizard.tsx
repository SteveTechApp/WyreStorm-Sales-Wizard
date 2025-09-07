
import React, { useState, useEffect, useMemo } from 'react';
import { RoomWizardAnswers, SolutionVisualization, DisplayConfiguration, SuggestedConfiguration } from '../types';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS, COMMON_FEATURES, ROOM_SPECIFIC_FEATURES, PRIMARY_USE_OPTIONS, DISPLAY_TYPE_OPTIONS } from '../constants';
import { visualizeSolution, suggestRoomConfiguration } from '../services/geminiService';
import SolutionVisualizerModal from './SolutionVisualizerModal';
import LoadingSpinner from './LoadingSpinner';

interface RoomWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (answers: RoomWizardAnswers, roomType: string, designTier: string) => void;
}

const RoomWizard: React.FC<RoomWizardProps> = ({ isOpen, onClose, onAdd }) => {
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
    // Reset state when modal is opened
    if (isOpen) {
      setStep(1);
      setSuggestion(null);
      setIsSuggesting(false);
      setRoomName('');
      setParticipantCount(10);
      setPrimaryUse(PRIMARY_USE_OPTIONS[0]);
      setRoomType(ROOM_TYPES[0]);
      setDesignTier(DESIGN_TIER_OPTIONS[1]);
      setFeatures([]);
      setDisplayConfiguration([{ type: DISPLAY_TYPE_OPTIONS[0].id, quantity: 1 }]);
    }
  }, [isOpen]);

  const handleGetSuggestion = async () => {
    setIsSuggesting(true);
    setStep(2);
    try {
        const result = await suggestRoomConfiguration({ participantCount, primaryUse });
        setSuggestion(result);
        // Populate form state with AI suggestions
        setRoomType(result.roomType);
        setDesignTier(result.designTier);
        setFeatures(result.features);
        // Map display labels from constants to ensure correct dropdown values
        const suggestedDisplays = result.displayConfiguration.map(d => ({
            ...d,
            type: DISPLAY_TYPE_OPTIONS.find(opt => opt.label === d.type)?.id || d.type
        }));
        setDisplayConfiguration(suggestedDisplays);
        
        if (!roomName.trim()) {
            setRoomName(`${result.designTier} ${result.roomType}`);
        }
    } catch (e) {
        console.error("Failed to get suggestion:", e);
        setStep(1); // Go back to step 1 on error
    } finally {
        setIsSuggesting(false);
    }
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

  const renderStep1 = () => (
     <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-700">Step 1: Describe Your Needs</h3>
        <p className="text-sm text-gray-500 -mt-4">Provide some basic details, and our AI will suggest a complete room configuration for you to refine.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">Room Name (Optional)</label>
                <input type="text" id="roomName" value={roomName} onChange={e => setRoomName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Executive Boardroom" />
            </div>
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

  const renderStep2 = () => (
    <div className="animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-700">Step 2: AI Recommended Configuration</h3>
        <p className="text-sm text-gray-500 -mt-1 mb-4">Here is our AI's suggestion. Feel free to adjust any setting.</p>

        {suggestion && (
            <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-800 text-sm mb-1">AI Recommendation</h4>
                <p className="text-xs text-blue-700">{suggestion.summary}</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[55vh] overflow-y-auto pr-3">
             {/* Row 1 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select value={roomType} onChange={e => setRoomType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                    {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
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
        {step === 2 && isSuggesting && <LoadingSpinner message="Generating AI Configuration..." />}
        {step === 2 && !isSuggesting && renderStep2()}

        <div className="mt-8 flex justify-between items-center">
            <div>
                 {step > 1 && !isSuggesting && <button onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">Back</button>}
            </div>
            <div>
                <button type="button" onClick={onClose} className="text-gray-600 font-medium py-2 px-4 rounded-md mr-2">Cancel</button>
                {step === 1 && <button onClick={handleGetSuggestion} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">Get AI Suggestion</button>}
                {step === 2 && !isSuggesting && <button onClick={handleSubmit} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">Add Room to Project</button>}
            </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default RoomWizard;
