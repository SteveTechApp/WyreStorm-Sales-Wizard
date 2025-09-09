

import React, { useState } from 'react';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from '../constants';

interface AddRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (roomType: string, designTier: string) => void;
    isAdding: boolean;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onAdd, isAdding }) => {
    const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
    // FIX: Explicitly type the designTier state to allow any of the three tier options, resolving an assignment error.
    const [designTier, setDesignTier] = useState<'Bronze' | 'Silver' | 'Gold'>(DESIGN_TIER_OPTIONS[1]); // Default to Silver

    if (!isOpen) return null;
    
    const handleAddClick = () => {
        onAdd(roomType, designTier);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Room</h2>
                <p className="text-sm text-gray-500 mb-6">Select a room type and a design tier to get an AI-generated starting point.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="roomTypeSelect" className="block text-sm font-medium text-gray-700">Room Type</label>
                        <select id="roomTypeSelect" value={roomType} onChange={e => setRoomType(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                            {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Design Tier</label>
                        <div className="mt-2 space-y-2">
                           {DESIGN_TIER_OPTIONS.map(tier => (
                               <label key={tier} className="flex items-center p-3 border rounded-md has-[:checked]:bg-green-50 has-[:checked]:border-green-400 cursor-pointer">
                                   <input type="radio" name="designTier" value={tier} checked={designTier === tier} onChange={() => setDesignTier(tier)} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                                   <span className="ml-3 text-sm font-medium text-gray-700">{tier}</span>
                               </label>
                           ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">Cancel</button>
                    <button type="button" onClick={handleAddClick} disabled={isAdding} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400">
                        {isAdding ? 'Adding...' : 'Add Room'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoomModal;
