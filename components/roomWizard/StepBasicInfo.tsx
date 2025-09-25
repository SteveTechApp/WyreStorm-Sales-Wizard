import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RoomWizardAnswers, DesignTier, IOPoint, VideoWallConfig } from '../../utils/types.ts';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from '../../data/constants.ts';
import { useAppContext } from '../../context/AppContext.tsx';
import TierIcon from '../TierIcon.tsx';
import InfoTooltip from '../InfoTooltip.tsx';
import TierInfoModal from '../TierInfoModal.tsx';
import VideoWallWizardModal from './VideoWallWizardModal.tsx';
import IOPointEditor from './IOPointEditor.tsx';
import IOPointConfigModal from './IOPointConfigModal.tsx';

interface StepProps {
    answers: RoomWizardAnswers & { customRoomType?: string };
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
}

const TIER_STYLES: Record<DesignTier, { bg: string, border: string, text: string, hoverBorder: string }> = {
    Bronze: { bg: 'bg-[#cd7f32]/20', border: 'border-[#cd7f32]', text: 'text-[#cd7f32]', hoverBorder: 'hover:border-[#cd7f32]' },
    Silver: { bg: 'bg-gray-400/20', border: 'border-gray-500', text: 'text-gray-500', hoverBorder: 'hover:border-gray-500' },
    Gold: { bg: 'bg-yellow-400/20', border: 'border-yellow-500', text: 'text-yellow-500', hoverBorder: 'hover:border-yellow-500' },
};

const StepBasicInfo: React.FC<StepProps> = ({ answers, setAnswers }) => {
    const { userProfile } = useAppContext();
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [unitSystem, setUnitSystem] = useState(userProfile?.unitSystem || 'metric');
    
    // --- Modal State ---
    const [editingPoint, setEditingPoint] = useState<IOPoint | null>(null);
    const [isVideoWallModalOpen, setIsVideoWallModalOpen] = useState(false);
    const [configuringIOPointId, setConfiguringIOPointId] = useState<string | null>(null);
    
    const METRIC_TO_IMPERIAL = 3.28084;

    const getDisplayValue = (meters: number) => {
        if (unitSystem === 'imperial') {
            return parseFloat((meters * METRIC_TO_IMPERIAL).toFixed(2));
        }
        return meters;
    };

    const getStoredValue = (displayValue: number) => {
        if (unitSystem === 'imperial') {
            return parseFloat((displayValue / METRIC_TO_IMPERIAL).toFixed(2));
        }
        return displayValue;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAnswers(prev => ({ ...prev, [name]: value }));
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const storedValue = getStoredValue(parseFloat(value) || 0);
        setAnswers(prev => ({ ...prev, dimensions: { ...prev.dimensions, [name]: storedValue } }));
    };

    const handleTierChange = (tier: DesignTier) => {
        setAnswers(prev => ({...prev, designTier: tier}));
    };
    
    // --- I/O Management ---
    const handleAddIO = (type: 'input' | 'output') => {
        const newPoint: IOPoint = {
            id: uuidv4(),
            type,
            quantity: 1,
            name: type === 'input' ? 'New Source' : 'New Display',
            connectionType: 'HDMI',
            distributionType: 'Direct',
            distance: 5,
            terminationType: 'Wall Plate',
            displayType: 'single',
            projectorLensType: 'standard',
        };
        setEditingPoint(newPoint);
    };

    const handleEditIO = (id: string) => {
        const pointToEdit = answers.ioRequirements.find(p => p.id === id);
        if (pointToEdit) {
            setEditingPoint(pointToEdit);
        }
    };
    
    const handleSaveIO = (pointToSave: IOPoint) => {
        setAnswers(prev => {
            const exists = prev.ioRequirements.some(p => p.id === pointToSave.id);
            const newRequirements = exists
                ? prev.ioRequirements.map(p => p.id === pointToSave.id ? pointToSave : p)
                : [...prev.ioRequirements, pointToSave];
            return { ...prev, ioRequirements: newRequirements };
        });
        setEditingPoint(null);
    };

    const handleRemoveIO = (id: string) => {
        setAnswers(prev => ({ ...prev, ioRequirements: prev.ioRequirements.filter(p => p.id !== id)}));
    };

    const handleDuplicateIO = (id: string) => {
        const pointToDuplicate = answers.ioRequirements.find(p => p.id === id);
        if (!pointToDuplicate) return;

        const newPoint = { ...pointToDuplicate, id: uuidv4() };
        setAnswers(prev => {
            const index = prev.ioRequirements.findIndex(p => p.id === id);
            const newRequirements = [...prev.ioRequirements];
            newRequirements.splice(index + 1, 0, newPoint);
            return { ...prev, ioRequirements: newRequirements };
        });
    };

    // --- Video Wall Management ---
    const handleConfigureVideoWall = (pointId: string) => {
        setConfiguringIOPointId(pointId);
        setIsVideoWallModalOpen(true);
        setEditingPoint(null);
    };
    
    const handleSaveVideoWallConfig = (config: VideoWallConfig) => {
        if (!configuringIOPointId) return;
        
        const newQuantity = config.layout.rows * config.layout.cols;
        
        setAnswers(prev => ({
            ...prev,
            videoWallConfig: config,
            ioRequirements: prev.ioRequirements.map(p => 
                p.id === configuringIOPointId 
                ? { ...p, quantity: newQuantity } 
                : p
            )
        }));
        
        setIsVideoWallModalOpen(false);
        setConfiguringIOPointId(null);
    };

    const currentlyConfiguringPoint = answers.ioRequirements.find(p => p.id === configuringIOPointId);

    return (
        <>
        <section className="animate-fade-in-fast space-y-8">
            {/* Basic Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="roomName" className="font-semibold text-text-primary">Room Name</label>
                    <InfoTooltip text="A descriptive name for this room, e.g., 'Main Boardroom' or 'Classroom 101'." />
                </div>
                <input type="text" id="roomName" name="roomName" value={answers.roomName} onChange={handleChange} placeholder="e.g., Main Boardroom" className="w-full p-2 border border-border-color rounded-md bg-input-bg" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label htmlFor="roomType" className="font-semibold text-text-primary">Room Type</label>
                            <InfoTooltip text="Select the primary function of the room. This helps the AI make better design choices." />
                        </div>
                        <select id="roomType" name="roomType" value={answers.roomType} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg">
                            {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    {answers.roomType === 'Other' && (
                        <div className="self-end">
                             <div className="flex items-center gap-2 mb-1">
                                 <label htmlFor="customRoomType" className="font-semibold text-text-primary">Custom Type</label>
                                 <InfoTooltip text="Please specify the type of room, e.g., 'Broadcast Studio' or 'Training Room'." />
                             </div>
                            <input type="text" id="customRoomType" name="customRoomType" value={answers.customRoomType || ''} onChange={handleChange} placeholder="Please specify" className="p-2 border border-border-color rounded-md bg-input-bg w-full" />
                        </div>
                    )}
                </div>
            </div>

            {/* I/O Requirements */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-text-primary">Inputs (Sources)</h3>
                        <InfoTooltip text="Define all the sources that need to be connected to the system, like laptops, media players, or cameras." />
                    </div>
                    <button type="button" onClick={() => handleAddIO('input')} className="text-sm bg-primary/20 text-primary font-semibold py-1 px-3 rounded-md hover:bg-primary/30">Add Input</button>
                </div>
                <div className="space-y-2">
                    {answers.ioRequirements.filter(p => p.type === 'input').map(p => <IOPointEditor key={p.id} point={p} onEdit={handleEditIO} onRemove={handleRemoveIO} onDuplicate={handleDuplicateIO} unit={unitSystem === 'metric' ? 'm' : 'ft'} />)}
                </div>
            </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <h3 className="font-semibold text-lg text-text-primary">Outputs (Displays)</h3>
                         <InfoTooltip text="Define all the displays, projectors, or other devices the system needs to send signals to." />
                    </div>
                     <button type="button" onClick={() => handleAddIO('output')} className="text-sm bg-primary/20 text-primary font-semibold py-1 px-3 rounded-md hover:bg-primary/30">Add Output</button>
                </div>
                 <div className="space-y-2">
                    {answers.ioRequirements.filter(p => p.type === 'output').map(p => <IOPointEditor key={p.id} point={p} onEdit={handleEditIO} onRemove={handleRemoveIO} onDuplicate={handleDuplicateIO} unit={unitSystem === 'metric' ? 'm' : 'ft'} />)}
                </div>
            </div>

            {/* Room Specs */}
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                             <label className="font-semibold text-text-primary">Room Dimensions</label>
                             <InfoTooltip text="Enter the room's length, width, and height. This is crucial for calculating cable lengths and speaker coverage." />
                        </div>
                        <div className="flex items-center gap-2">
                             <input type="number" name="length" value={getDisplayValue(answers.dimensions.length)} onChange={handleDimensionChange} placeholder="Length" className="w-full p-2 border border-border-color rounded-md bg-input-bg" />
                             <span className="text-text-secondary">&times;</span>
                             <input type="number" name="width" value={getDisplayValue(answers.dimensions.width)} onChange={handleDimensionChange} placeholder="Width" className="w-full p-2 border border-border-color rounded-md bg-input-bg" />
                             <span className="text-text-secondary">&times;</span>
                             <input type="number" name="height" value={getDisplayValue(answers.dimensions.height)} onChange={handleDimensionChange} placeholder="Height" className="w-full p-2 border border-border-color rounded-md bg-input-bg" />
                             <div className="flex items-center rounded-md border border-border-color p-0.5 bg-background">
                                 <button type="button" onClick={() => setUnitSystem('metric')} className={`px-2 py-1 text-xs rounded ${unitSystem === 'metric' ? 'bg-primary text-text-on-accent' : 'text-text-secondary'}`}>m</button>
                                 <button type="button" onClick={() => setUnitSystem('imperial')} className={`px-2 py-1 text-xs rounded ${unitSystem === 'imperial' ? 'bg-primary text-text-on-accent' : 'text-text-secondary'}`}>ft</button>
                             </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label htmlFor="maxParticipants" className="font-semibold text-text-primary">Max Participants</label>
                            <InfoTooltip text="The maximum number of people the room is designed to hold. This influences microphone and speaker selection." />
                        </div>
                        <input type="number" id="maxParticipants" name="maxParticipants" value={answers.maxParticipants} onChange={handleChange} placeholder="Max Participants" className="w-full p-2 border border-border-color rounded-md bg-input-bg" />
                    </div>
                 </div>
            </div>

            {/* Design Tier */}
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <label className="font-semibold text-lg text-text-primary">Design Tier</label>
                    <button type="button" onClick={() => setIsTierModalOpen(true)} className="text-sm text-primary hover:underline">What's this?</button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                     {DESIGN_TIER_OPTIONS.map(tier => {
                        const styles = TIER_STYLES[tier];
                        const isSelected = answers.designTier === tier;
                        return (
                         <button 
                            type="button" 
                            key={tier} 
                            onClick={() => handleTierChange(tier as DesignTier)} 
                            className={`p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all ${isSelected ? `${styles.bg} ${styles.border}` : `border-border-color ${styles.hoverBorder}`}`}
                        >
                            <TierIcon tier={tier} className="h-8 w-8 flex-shrink-0"/>
                            <div>
                                <span className={`font-bold ${isSelected ? styles.text : 'text-text-primary'}`}>{tier}</span>
                                <p className="text-xs text-text-secondary">{tier === 'Bronze' ? 'Core functionality' : tier === 'Silver' ? 'Balanced features' : 'Premium performance'}</p>
                            </div>
                        </button>
                     )}
                    )}
                 </div>
            </div>
        </section>
        <TierInfoModal isOpen={isTierModalOpen} onClose={() => setIsTierModalOpen(false)} />
        <IOPointConfigModal
            isOpen={!!editingPoint}
            onClose={() => setEditingPoint(null)}
            onSave={handleSaveIO}
            point={editingPoint}
            unit={unitSystem === 'metric' ? 'm' : 'ft'}
            onConfigureVideoWall={handleConfigureVideoWall}
        />
        {currentlyConfiguringPoint && (
            <VideoWallWizardModal
                isOpen={isVideoWallModalOpen}
                onClose={() => setIsVideoWallModalOpen(false)}
                onSave={handleSaveVideoWallConfig}
                initialConfig={answers.videoWallConfig}
                displayType={currentlyConfiguringPoint.displayType as any}
            />
        )}
        </>
    );
};

export default StepBasicInfo;