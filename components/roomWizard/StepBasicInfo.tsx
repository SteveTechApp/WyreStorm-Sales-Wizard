import React from 'react';
import { RoomWizardAnswers, DesignTier } from '../../utils/types';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from '../../data/constants';

interface StepProps {
    answers: RoomWizardAnswers & { customRoomType?: string };
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
}

const StepBasicInfo: React.FC<StepProps> = ({ answers, setAnswers }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAnswers(prev => ({ ...prev, [name]: value }));
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAnswers(prev => ({ ...prev, dimensions: { ...prev.dimensions, [name]: parseFloat(value) || 0 } }));
    };

    const handleTierChange = (tier: DesignTier) => {
        setAnswers(prev => ({...prev, designTier: tier}));
    };

    return (
        <section className="animate-fade-in-fast space-y-6">
            <h3 className="font-semibold text-lg text-gray-700">Basic Room Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="roomName" value={answers.roomName} onChange={handleChange} placeholder="Room Name (e.g., Main Boardroom)" className="p-2 border border-gray-300 rounded-md" />
                <select name="roomType" value={answers.roomType} onChange={handleChange} className="p-2 border border-gray-300 rounded-md">
                    {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {answers.roomType === 'Other' && (
                    <input type="text" name="customRoomType" value={answers.customRoomType || ''} onChange={handleChange} placeholder="Please specify room type" className="p-2 border border-gray-300 rounded-md md:col-span-2" />
                )}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" name="maxParticipants" value={answers.maxParticipants} onChange={handleChange} placeholder="Max Participants" className="p-2 border border-gray-300 rounded-md" />
                 <div className="grid grid-cols-3 gap-2">
                     <input type="number" name="length" value={answers.dimensions.length} onChange={handleDimensionChange} placeholder="Length (m)" className="p-2 border border-gray-300 rounded-md" />
                     <input type="number" name="width" value={answers.dimensions.width} onChange={handleDimensionChange} placeholder="Width (m)" className="p-2 border border-gray-300 rounded-md" />
                     <input type="number" name="height" value={answers.dimensions.height} onChange={handleDimensionChange} placeholder="Height (m)" className="p-2 border border-gray-300 rounded-md" />
                 </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Design Tier</label>
                 <div className="flex gap-2">
                     {DESIGN_TIER_OPTIONS.map(tier => (
                         <button type="button" key={tier} onClick={() => handleTierChange(tier)} className={`w-full p-2 rounded-md border-2 ${answers.designTier === tier ? 'border-primary bg-primary/10' : 'border-gray-300'}`}>{tier}</button>
                     ))}
                 </div>
            </div>
        </section>
    );
};

export default StepBasicInfo;
