
import React, { useState, useEffect } from 'react';
import { RoomData, RoomWizardAnswers, UnitSystem } from '../utils/types';
import { ROOM_TYPES } from '../data/constants';
import WizardNavigation from './roomWizard/WizardNavigation';
import StepBasicInfo from './roomWizard/StepBasicInfo';
import StepFeatures from './roomWizard/StepFeatures';
import StepTechnical from './roomWizard/StepTechnical';
import StepEnvironment from './roomWizard/StepEnvironment';
import { createDefaultRoomData } from '../utils/utils';

interface RoomWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (answers: RoomWizardAnswers) => void;
    initialData?: RoomData | null;
    unitSystem: UnitSystem;
}

const getInitialState = (initialData: RoomData | null, unitSystem: UnitSystem): RoomWizardAnswers & { customRoomType?: string } => {
    const defaults = createDefaultRoomData();
    const data = initialData || defaults;
    
    let roomType = ROOM_TYPES[0];
    let customRoomType = '';
    if (ROOM_TYPES.includes(data.roomType)) {
        roomType = data.roomType;
    } else if (data.roomType) {
        roomType = 'Other';
        customRoomType = data.roomType;
    }

    // This ensures all fields from RoomData that are part of RoomWizardAnswers are present.
    const initialState: RoomWizardAnswers & { customRoomType?: string } = {
        roomName: data.roomName,
        roomType: roomType,
        customRoomType: customRoomType,
        designTier: data.designTier,
        maxParticipants: data.maxParticipants,
        features: data.features,
        dimensions: data.dimensions,
        requiredResolution: data.requiredResolution,
        hdrRequirements: data.hdrRequirements,
        wirelessCasting: data.wirelessCasting,
        hdbasetStandard: data.hdbasetStandard,
        constructionDetails: data.constructionDetails,
        audioSystemDetails: data.audioSystemDetails,
        displayType: data.displayType,
        displayCount: data.displayCount,
        primarySources: data.primarySources,
    };
    return initialState;
};


const RoomWizard: React.FC<RoomWizardProps> = ({ isOpen, onClose, onUpdate, initialData, unitSystem }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<RoomWizardAnswers & { customRoomType?: string }>(() => getInitialState(initialData, unitSystem));
    const [errors, setErrors] = useState<{ roomName?: string; dimensions?: string; customRoomType?: string; }>({});
    
    const steps = ['Basic Info', 'Features', 'Technical Specs', 'Environment'];

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setAnswers(getInitialState(initialData, unitSystem));
            setErrors({});
        }
    }, [isOpen, initialData, unitSystem]);
    
    const validateBasics = () => {
        const finalErrors: typeof errors = {};
        if (answers.roomName.length > 50) finalErrors.roomName = 'Room name cannot exceed 50 characters.';
        if (!answers.roomName.trim()) finalErrors.roomName = 'Room name is required.';
        if (answers.roomType === 'Other' && !answers.customRoomType?.trim()) {
            finalErrors.customRoomType = 'Custom room type is required.';
        }
        const { length, width, height } = answers.dimensions;
        if (length <= 0 || width <= 0 || height <= 0) {
            finalErrors.dimensions = 'All dimensions must be valid positive numbers.';
        }
        setErrors(finalErrors);
        return Object.keys(finalErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 0 && !validateBasics()) return;
        setCurrentStep(s => Math.min(s + 1, steps.length - 1));
    };
    
    const handlePrev = () => setCurrentStep(s => Math.max(s - 1, 0));

    const handleFinish = () => {
        if (!validateBasics()) {
            setCurrentStep(0);
            return;
        }
        const finalAnswers: RoomWizardAnswers = {
            ...answers,
            roomType: answers.roomType === 'Other' ? answers.customRoomType || 'Custom' : answers.roomType,
        };
        onUpdate(finalAnswers);
        onClose();
    };

    if (!isOpen) return null;
    
    const isSubmittable = Object.keys(errors).length === 0 && answers.roomName.trim() !== '' && (answers.roomType !== 'Other' || answers.customRoomType?.trim() !== '');

    const renderStepContent = () => {
        const props = { answers, setAnswers, errors, setErrors, unitSystem };
        switch (currentStep) {
            case 0: return <StepBasicInfo {...props} />;
            case 1: return <StepFeatures {...props} />;
            case 2: return <StepTechnical {...props} />;
            case 3: return <StepEnvironment {...props} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-border-color bg-background-secondary rounded-t-lg">
                    <h2 className="text-2xl font-bold text-text-primary">{initialData ? 'Reconfigure Room' : 'Add New Room'}</h2>
                </div>
                
                <WizardNavigation steps={steps} currentStep={currentStep} />

                <div className="p-6 overflow-y-auto max-h-[60vh] min-h-[300px]">
                    {renderStepContent()}
                </div>

                <div className="p-4 flex justify-between items-center border-t border-border-color bg-background/70 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-background-secondary hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md border border-border-color">
                        Cancel
                    </button>
                    <div className="flex gap-3">
                        {currentStep > 0 && <button type="button" onClick={handlePrev} className="bg-background-secondary hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md border border-border-color">Previous</button>}
                        {currentStep < steps.length - 1 ? (
                            <button type="button" onClick={handleNext} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Next</button>
                        ) : (
                            <button type="button" onClick={handleFinish} disabled={!isSubmittable} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md disabled:bg-gray-400">Update Configuration</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomWizard;
