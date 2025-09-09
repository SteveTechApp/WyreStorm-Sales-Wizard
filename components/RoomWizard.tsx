
import React, { useState, useEffect } from 'react';
import { RoomData, RoomWizardAnswers } from '../types';
import { DESIGN_TIER_OPTIONS, ROOM_TYPES } from '../constants';

interface RoomWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (answers: RoomWizardAnswers, roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold') => void;
    initialData?: RoomData | null;
}

const RoomWizard: React.FC<RoomWizardProps> = ({ isOpen, onClose, onAdd, initialData }) => {
    const [step, setStep] = useState(1);
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
    const [designTier, setDesignTier] = useState<'Bronze' | 'Silver' | 'Gold'>('Silver');
    const [participantCount, setParticipantCount] = useState(10);
    const [videoInputs, setVideoInputs] = useState<{ type: string, count: number }[]>([{ type: 'HDMI', count: 1 }]);
    const [videoOutputs, setVideoOutputs] = useState<{ type: string, count: number }[]>([{ type: 'Display', count: 1 }]);
    const [audioNeeds, setAudioNeeds] = useState<string[]>([]);
    const [controlNeeds, setControlNeeds] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setRoomName(initialData.roomName);
                setRoomType(initialData.roomType);
                setDesignTier(initialData.designTier);
                setParticipantCount(initialData.maxParticipants);
                // Reset other fields to defaults or derive from initialData if available
                setVideoInputs([{ type: 'HDMI', count: 2 }, { type: 'USB-C', count: 1 }]);
                setVideoOutputs([{ type: 'Display', count: 1 }]);
                setAudioNeeds(initialData.audioUseCases || []);
                setControlNeeds([]);
            } else {
                // Reset to defaults for a new room
                setStep(1);
                setRoomName('New Room');
                setRoomType(ROOM_TYPES[0]);
                setDesignTier('Silver');
                setParticipantCount(10);
                setVideoInputs([{ type: 'HDMI', count: 1 }]);
                setVideoOutputs([{ type: 'Display', count: 1 }]);
                setAudioNeeds([]);
                setControlNeeds([]);
            }
        }
    }, [isOpen, initialData]);

    const handleFinish = () => {
        const answers: RoomWizardAnswers = {
            roomName,
            participantCount,
            videoInputs,
            videoOutputs,
            audioNeeds,
            controlNeeds,
        };
        onAdd(answers, roomType, designTier);
        onClose();
    };

    if (!isOpen) return null;

    const renderStep = () => {
        // For simplicity, this is a single-step wizard. Could be expanded later.
        return (
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Room Name</label>
                    <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room Type</label>
                        <select value={roomType} onChange={e => setRoomType(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                            {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                        <input type="number" value={participantCount} onChange={e => setParticipantCount(Number(e.target.value) || 0)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                 </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Design Tier</label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        {DESIGN_TIER_OPTIONS.map(tier => (
                            <label key={tier} className={`text-center p-3 border rounded-md cursor-pointer ${designTier === tier ? 'bg-green-50 border-green-400' : 'bg-white'}`}>
                                <input type="radio" name="designTier" value={tier} checked={designTier === tier} onChange={() => setDesignTier(tier)} className="sr-only" />
                                <span className="text-sm font-medium text-gray-700">{tier}</span>
                            </label>
                        ))}
                    </div>
                </div>
                 {/* Simplified sections for other questions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Audio Needs</label>
                    <div className="flex gap-2">
                        <button onClick={() => setAudioNeeds(['speech', 'conferencing'])} className={`text-sm p-2 border rounded-md ${audioNeeds.includes('conferencing') ? 'bg-blue-100 border-blue-300' : ''}`}>Conferencing</button>
                        <button onClick={() => setAudioNeeds(['program'])} className={`text-sm p-2 border rounded-md ${audioNeeds.includes('program') ? 'bg-blue-100 border-blue-300' : ''}`}>Presentation Audio</button>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Control System</label>
                     <div className="flex gap-2">
                        <button onClick={() => setControlNeeds(['touchpanel'])} className={`text-sm p-2 border rounded-md ${controlNeeds.includes('touchpanel') ? 'bg-blue-100 border-blue-300' : ''}`}>Touch Panel</button>
                        <button onClick={() => setControlNeeds(['keypad'])} className={`text-sm p-2 border rounded-md ${controlNeeds.includes('keypad') ? 'bg-blue-100 border-blue-300' : ''}`}>Keypad</button>
                    </div>
                </div>
             </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{initialData ? 'Reconfigure Room' : 'Add New Room'}</h2>
                
                {renderStep()}

                <div className="mt-6 flex justify-between items-center">
                     <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">
                        Cancel
                    </button>
                    <button type="button" onClick={handleFinish} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">
                        {initialData ? 'Update Room' : 'Add Room'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomWizard;
