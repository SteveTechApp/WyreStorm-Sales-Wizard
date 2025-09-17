
import React from 'react';
import { RoomWizardAnswers, UnitSystem } from '../../utils/types';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from '../../data/constants';

interface StepProps {
    answers: RoomWizardAnswers & { customRoomType?: string };
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
    errors: { roomName?: string; dimensions?: string, customRoomType?: string };
    setErrors: React.Dispatch<React.SetStateAction<{ roomName?: string; dimensions?: string, customRoomType?: string }>>;
    unitSystem: UnitSystem;
}

const StepBasicInfo: React.FC<StepProps> = ({ answers, setAnswers, errors, setErrors, unitSystem }) => {

    const handleChange = (field: keyof RoomWizardAnswers | 'customRoomType', value: any) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
        if (errors.roomName && field === 'roomName' && value.trim()) {
            const { roomName, ...rest } = errors;
            setErrors(rest);
        }
         if (errors.customRoomType && field === 'customRoomType' && value.trim()) {
            const { customRoomType, ...rest } = errors;
            setErrors(rest);
        }
    };
    
    const handleDimensionChange = (field: 'length' | 'width' | 'height', value: string) => {
        const numValue = parseFloat(value);
        setAnswers(prev => ({
            ...prev,
            dimensions: {
                ...prev.dimensions,
                [field]: isNaN(numValue) ? 0 : numValue
            }
        }));
        if (errors.dimensions) {
             const { dimensions, ...rest } = errors;
            setErrors(rest);
        }
    };
    
    return (
        <section className="animate-fade-in-fast">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">System Name</label>
                        <input
                            type="text"
                            id="roomName"
                            value={answers.roomName}
                            onChange={e => handleChange('roomName', e.target.value)}
                            className={`mt-1 w-full p-2 border rounded-md ${errors.roomName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.roomName && <p className="text-red-600 text-xs mt-1">{errors.roomName}</p>}
                    </div>
                    <div>
                        <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">System Type</label>
                        <select
                            id="roomType"
                            value={answers.roomType}
                            onChange={e => handleChange('roomType', e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
                        >
                            {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    {answers.roomType === 'Other' && (
                         <div>
                            <label htmlFor="customRoomType" className="block text-sm font-medium text-gray-700">Custom System Type</label>
                            <input
                                type="text"
                                id="customRoomType"
                                value={answers.customRoomType || ''}
                                onChange={e => handleChange('customRoomType', e.target.value)}
                                className={`mt-1 w-full p-2 border rounded-md ${errors.customRoomType ? 'border-red-500' : 'border-gray-300'}`}
                            />
                             {errors.customRoomType && <p className="text-red-600 text-xs mt-1">{errors.customRoomType}</p>}
                        </div>
                    )}
                    <div>
                        <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">Max Participants</label>
                        <input
                            type="number"
                            id="maxParticipants"
                            min="1"
                            value={answers.maxParticipants}
                            onChange={e => handleChange('maxParticipants', parseInt(e.target.value, 10))}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Dimensions (m)</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="number" placeholder="L" value={answers.dimensions.length} onChange={e => handleDimensionChange('length', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                            <input type="number" placeholder="W" value={answers.dimensions.width} onChange={e => handleDimensionChange('width', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                            <input type="number" placeholder="H" value={answers.dimensions.height} onChange={e => handleDimensionChange('height', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                         {errors.dimensions && <p className="text-red-600 text-xs mt-1">{errors.dimensions}</p>}
                    </div>
                </div>

                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Design Tier</label>
                        <div className="mt-2 space-y-2">
                           {DESIGN_TIER_OPTIONS.map(tier => (
                               <label key={tier} className="flex items-center p-2 border rounded-md has-[:checked]:bg-green-50 has-[:checked]:border-green-400 cursor-pointer">
                                   <input type="radio" name="designTier" value={tier} checked={answers.designTier === tier} onChange={() => handleChange('designTier', tier)} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                                   <span className="ml-3 text-sm font-medium text-gray-700">{tier}</span>
                               </label>
                           ))}
                        </div>
                    </div>
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700">Display & Sources</label>
                        <div className="mt-2 space-y-3">
                            <input
                                type="text"
                                placeholder="Display Type (e.g., Video Wall, Projector)"
                                value={answers.displayType || ''}
                                onChange={e => handleChange('displayType', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="number"
                                placeholder="Number of Displays"
                                value={answers.displayCount || ''}
                                onChange={e => handleChange('displayCount', parseInt(e.target.value, 10))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                            />
                             <textarea
                                placeholder="Primary Sources (e.g., 2x Laptop, 1x Room PC, 4x TV)"
                                value={answers.primarySources || ''}
                                onChange={e => handleChange('primarySources', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md h-20 resize-y"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StepBasicInfo;
