import React, { useState, useEffect } from 'react';
import { RoomData, Feature, RoomWizardAnswers, UnitSystem, RoomDimensions } from '../utils/types';
import { 
    DESIGN_TIER_OPTIONS, 
    ROOM_TYPES, 
    COMMON_FEATURES,
    RESOLUTION_OPTIONS,
    HDR_OPTIONS,
    WIRELESS_CASTING_OPTIONS,
    HDBASET_OPTIONS,
} from '../data/constants';
import TierTooltip from './TierTooltip';

interface RoomWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (answers: RoomWizardAnswers) => void;
    initialData?: RoomData | null;
    unitSystem: UnitSystem;
}

const RoomWizard: React.FC<RoomWizardProps> = ({ isOpen, onClose, onUpdate, initialData, unitSystem }) => {
    const [roomName, setRoomName] = useState('New Room');
    const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
    const [designTier, setDesignTier] = useState<'Bronze' | 'Silver' | 'Gold'>('Silver');
    const [maxParticipants, setMaxParticipants] = useState(10);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [dimensions, setDimensions] = useState({ length: '20', width: '15', height: '9' });
    const [errors, setErrors] = useState<{ roomName?: string; dimensions?: string; }>({});
    
    // New technical requirements state
    const [requiredResolution, setRequiredResolution] = useState<RoomData['requiredResolution']>('4K60');
    const [hdrRequirements, setHdrRequirements] = useState<RoomData['hdrRequirements']>('HDR10');
    const [wirelessCasting, setWirelessCasting] = useState<RoomData['wirelessCasting']>('None');
    const [hdbasetStandard, setHdbasetStandard] = useState<RoomData['hdbasetStandard']>('Auto');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setRoomName(initialData.roomName);
                setRoomType(initialData.roomType);
                setDesignTier(initialData.designTier);
                setMaxParticipants(initialData.maxParticipants);
                setFeatures(initialData.features || []);
                setDimensions({
                    length: String(initialData.dimensions.length),
                    width: String(initialData.dimensions.width),
                    height: String(initialData.dimensions.height)
                });
                setRequiredResolution(initialData.requiredResolution || '4K60');
                setHdrRequirements(initialData.hdrRequirements || 'HDR10');
                setWirelessCasting(initialData.wirelessCasting || 'None');
                setHdbasetStandard(initialData.hdbasetStandard || 'Auto');
            } else {
                // Reset to defaults for a new room
                setRoomName('New Room');
                setRoomType(ROOM_TYPES[0]);
                setDesignTier('Silver');
                setMaxParticipants(10);
                setFeatures([]);
                setDimensions({ length: '20', width: '15', height: '9' });
                setRequiredResolution('4K60');
                setHdrRequirements('HDR10');
                setWirelessCasting('None');
                setHdbasetStandard('Auto');
            }
            setErrors({});
        }
    }, [isOpen, initialData]);

    const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        if (name.length > 50) {
            setErrors(prev => ({ ...prev, roomName: 'Room name cannot exceed 50 characters.' }));
        } else {
            setErrors(prev => {
                const { roomName, ...rest } = prev;
                return rest;
            });
        }
        setRoomName(name);
    };

    const handleDimensionChange = (field: keyof RoomDimensions, value: string) => {
        const sanitizedValue = value.replace(/[^0-9.]/g, '');
        setDimensions(prev => ({ ...prev, [field]: sanitizedValue }));

        // Check all dimensions for validity
        const currentDims = { ...dimensions, [field]: sanitizedValue };
        const allValid = Object.values(currentDims).every(dim => {
            const numValue = parseFloat(dim);
            return dim.trim() !== '' && !isNaN(numValue) && numValue > 0;
        });

        if (!allValid) {
            setErrors(prev => ({ ...prev, dimensions: 'Dimensions must be positive numbers.' }));
        } else {
            setErrors(prev => {
                const { dimensions, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleFeatureToggle = (featureName: string) => {
        const existingFeature = features.find(f => f.name === featureName);
        if (existingFeature) {
            setFeatures(features.filter(f => f.name !== featureName));
        } else {
            setFeatures([...features, { name: featureName, priority: 'must-have' }]);
        }
    };

    const handlePriorityChange = (featureName: string, priority: 'must-have' | 'nice-to-have') => {
        setFeatures(features.map(f => f.name === featureName ? { ...f, priority } : f));
    };

    const handleFinish = () => {
        const finalErrors: { roomName?: string; dimensions?: string } = {};
        if (roomName.length > 50) finalErrors.roomName = 'Room name cannot exceed 50 characters.';
        if (!roomName.trim()) finalErrors.roomName = 'Room name is required.';

        const length = parseFloat(dimensions.length);
        const width = parseFloat(dimensions.width);
        const height = parseFloat(dimensions.height);

        if (isNaN(length) || length <= 0 || isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
            finalErrors.dimensions = 'All dimensions must be valid positive numbers.';
        }
        
        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            return;
        }

        const answers: RoomWizardAnswers = {
            roomName,
            roomType,
            designTier,
            maxParticipants,
            features,
            dimensions: { length, width, height },
            requiredResolution,
            hdrRequirements,
            wirelessCasting,
            hdbasetStandard,
        };
        onUpdate(answers);
        onClose();
    };

    if (!isOpen) return null;
    
    const renderSelect = (label: string, value: any, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: any, label: string}[]) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select value={value} onChange={onChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                {options.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );

    const isSubmittable = Object.keys(errors).length === 0 && roomName.trim() !== '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Reconfigure Room' : 'Add New Room'}</h2>
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                    {/* Basic Info */}
                    <section>
                        <h3 className="font-semibold text-lg text-gray-700 mb-3">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Room Name</label>
                                <input type="text" value={roomName} onChange={handleRoomNameChange} className={`mt-1 w-full p-2 border rounded-md ${errors.roomName ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.roomName && <p className="text-red-600 text-xs mt-1">{errors.roomName}</p>}
                            </div>
                            <div>
                                 <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                                <input type="number" value={maxParticipants} onChange={e => setMaxParticipants(Number(e.target.value) || 0)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Room Type</label>
                                <select value={roomType} onChange={e => setRoomType(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                    {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-700">Design Tier</label>
                                <select value={designTier} onChange={e => setDesignTier(e.target.value as any)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                    {DESIGN_TIER_OPTIONS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                                </select>
                                <TierTooltip tier={designTier} />
                            </div>
                        </div>
                    </section>

                    {/* Dimensions */}
                     <section>
                        <h3 className="font-semibold text-lg text-gray-700 mb-3">Room Dimensions ({unitSystem === 'imperial' ? 'ft' : 'm'})</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Length</label>
                                <input type="text" value={dimensions.length} onChange={e => handleDimensionChange('length', e.target.value)} className={`mt-1 w-full p-2 border rounded-md ${errors.dimensions ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Width</label>
                                <input type="text" value={dimensions.width} onChange={e => handleDimensionChange('width', e.target.value)} className={`mt-1 w-full p-2 border rounded-md ${errors.dimensions ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Height</label>
                                <input type="text" value={dimensions.height} onChange={e => handleDimensionChange('height', e.target.value)} className={`mt-1 w-full p-2 border rounded-md ${errors.dimensions ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                         </div>
                         {errors.dimensions && <p className="text-red-600 text-xs mt-2">{errors.dimensions}</p>}
                    </section>

                    {/* Features */}
                    <section>
                        <h3 className="font-semibold text-lg text-gray-700 mb-3">Features</h3>
                        <div className="space-y-3">
                            {COMMON_FEATURES.map(featureName => {
                                const feature = features.find(f => f.name === featureName);
                                return (
                                    <div key={featureName} className={`p-3 border rounded-md transition-colors ${feature ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={!!feature} onChange={() => handleFeatureToggle(featureName)} className="h-5 w-5 rounded text-green-600 focus:ring-green-500 border-gray-300" />
                                                <span className="font-medium text-gray-800">{featureName}</span>
                                            </label>
                                            {feature && (
                                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-0.5">
                                                    <button onClick={() => handlePriorityChange(featureName, 'must-have')} className={`px-3 py-1 text-xs rounded-full ${feature.priority === 'must-have' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}>Must Have</button>
                                                    <button onClick={() => handlePriorityChange(featureName, 'nice-to-have')} className={`px-3 py-1 text-xs rounded-full ${feature.priority === 'nice-to-have' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>Nice to Have</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                    
                    {/* Technical Requirements */}
                    <section>
                        <h3 className="font-semibold text-lg text-gray-700 mb-3">Technical Requirements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderSelect('Resolution', requiredResolution, e => setRequiredResolution(e.target.value as any), RESOLUTION_OPTIONS)}
                            {renderSelect('HDR', hdrRequirements, e => setHdrRequirements(e.target.value as any), HDR_OPTIONS)}
                            {renderSelect('Wireless Casting', wirelessCasting, e => setWirelessCasting(e.target.value as any), WIRELESS_CASTING_OPTIONS)}
                            {renderSelect('HDBaseT Standard', hdbasetStandard, e => setHdbasetStandard(e.target.value as any), HDBASET_OPTIONS)}
                        </div>
                    </section>
                </div>

                <div className="p-4 flex justify-end items-center border-t bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">
                        Cancel
                    </button>
                    <button type="button" onClick={handleFinish} disabled={!isSubmittable} className="ml-3 bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Update Room Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomWizard;