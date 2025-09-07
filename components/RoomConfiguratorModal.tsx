
import React, { useState, useEffect } from 'react';
import { RoomData, TieredRoomResponse, RoomTierOption } from '../types';
import { generateTieredRoomOptions } from '../services/geminiService';
import { ROOM_TYPES, PRIMARY_USE_OPTIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface RoomConfiguratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomConfigured: (roomData: Omit<RoomData, 'id'>) => void;
    existingRoom?: RoomData | null;
}

const RoomConfiguratorModal: React.FC<RoomConfiguratorModalProps> = ({ isOpen, onClose, onRoomConfigured, existingRoom }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [tieredResponse, setTieredResponse] = useState<TieredRoomResponse | null>(null);

    // Initial inputs
    const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
    const [primaryUse, setPrimaryUse] = useState(PRIMARY_USE_OPTIONS[0]);
    const [participantCount, setParticipantCount] = useState(10);
    
    useEffect(() => {
        if(isOpen) {
            if (existingRoom) {
                setRoomType(existingRoom.roomType);
                setPrimaryUse(existingRoom.primaryUse);
                setParticipantCount(existingRoom.maxParticipants);
                handleGetOptions(existingRoom.roomType, existingRoom.primaryUse, existingRoom.maxParticipants);
            } else {
                setStep(1);
                setTieredResponse(null);
                setRoomType(ROOM_TYPES[0]);
                setPrimaryUse(PRIMARY_USE_OPTIONS[0]);
                setParticipantCount(10);
            }
        }
    }, [isOpen, existingRoom]);
    
    const handleGetOptions = async (rt: string, pu: string, pc: number) => {
        setIsLoading(true);
        setStep(2);
        try {
            const response = await generateTieredRoomOptions(rt, pu, pc);
            setTieredResponse(response);
        } catch (error) {
            console.error("Failed to get tiered options", error);
            setStep(1); // Revert on error
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectOption = (option: RoomTierOption) => {
        onRoomConfigured(option.roomData);
        onClose();
    };

    const renderTierCard = (option: RoomTierOption, tier: 'Bronze' | 'Silver' | 'Gold') => {
        const TIER_STYLES = {
            Bronze: { border: 'border-yellow-400', bg: 'bg-yellow-50', button: 'bg-yellow-500 hover:bg-yellow-600' },
            Silver: { border: 'border-gray-400', bg: 'bg-gray-100', button: 'bg-gray-600 hover:bg-gray-700' },
            Gold: { border: 'border-amber-400', bg: 'bg-amber-50', button: 'bg-amber-500 hover:bg-amber-600' },
        };
        const styles = TIER_STYLES[tier];

        return (
            <div className={`p-4 border-2 rounded-lg flex flex-col ${styles.border} ${styles.bg}`}>
                <h3 className={`font-bold text-lg ${tier === 'Bronze' ? 'text-yellow-800' : tier === 'Silver' ? 'text-gray-800' : 'text-amber-800'}`}>{tier}</h3>
                <p className="text-sm text-gray-500">{option.roomData.functionalityStatement}</p>
                {option.roomData.businessJustification && (
                    <div className="mt-3 p-2 bg-white/50 rounded text-xs text-gray-700 italic border-l-4 border-gray-300">
                        <strong>Justification:</strong> {option.roomData.businessJustification}
                    </div>
                )}
                <div className="flex-grow mt-3">
                    <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Key Features</h4>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                        {option.roomData.features.slice(0, 4).map(f => <li key={f}>{f}</li>)}
                        {option.roomData.features.length > 4 && <li>And more...</li>}
                    </ul>
                </div>
                <button onClick={() => handleSelectOption(option)} className={`w-full mt-4 text-white font-bold py-2 rounded ${styles.button}`}>
                    Select {tier}
                </button>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{existingRoom ? `Configure: ${existingRoom.roomName}` : 'Add New Room'}</h2>
                
                {step === 1 && !existingRoom && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">Define the room's core purpose to get tailored AI suggestions.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Room Type</label>
                            <select value={roomType} onChange={e => setRoomType(e.target.value)} className="w-full p-2 border rounded mt-1">
                                {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Primary Use Case</label>
                            <select value={primaryUse} onChange={e => setPrimaryUse(e.target.value)} className="w-full p-2 border rounded mt-1">
                                {PRIMARY_USE_OPTIONS.map(pu => <option key={pu} value={pu}>{pu}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                            <input type="number" min="1" value={participantCount} onChange={e => setParticipantCount(Number(e.target.value))} className="w-full p-2 border rounded mt-1" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={() => handleGetOptions(roomType, primaryUse, participantCount)} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-6 rounded-md">
                                Get AI Options
                            </button>
                        </div>
                    </div>
                )}
                
                {(isLoading) && <div className="min-h-[300px] flex items-center justify-center"><LoadingSpinner message="Generating AI Options..." /></div>}

                {step === 2 && !isLoading && tieredResponse && (
                    <div>
                         <p className="text-sm text-gray-600 mb-4">The AI has generated three options. Select the one that best fits your client's needs and budget.</p>
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {renderTierCard(tieredResponse.bronze, 'Bronze')}
                            {renderTierCard(tieredResponse.silver, 'Silver')}
                            {renderTierCard(tieredResponse.gold, 'Gold')}
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomConfiguratorModal;
