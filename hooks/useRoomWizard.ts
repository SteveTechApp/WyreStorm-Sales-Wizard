import { useState, useEffect, useCallback } from 'react';
import { RoomData, RoomWizardAnswers, DisplayType } from '../utils/types.ts';
import { createNewRoom } from '../utils/utils.ts';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const createInitialAnswers = (initialData: RoomData | null): RoomWizardAnswers => {
    if (initialData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, systemDiagram, manuallyAddedEquipment, ...rest } = initialData;
        return rest;
    }
    const newRoomBase = createNewRoom();
    return {
        ...newRoomBase,
        roomName: 'New Room',
        roomType: 'Conference Room',
        designTier: 'Silver',
    };
};

export const useRoomWizard = (initialData: RoomData | null, onSave: (roomData: RoomData) => void, totalSteps: number) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<RoomWizardAnswers>(() => createInitialAnswers(initialData));
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setAnswers(createInitialAnswers(initialData));
        setErrors({});
        setCurrentStep(0);
    }, [initialData]);

    const updateAnswers = useCallback((newAnswers: Partial<RoomWizardAnswers>) => {
        setAnswers(prev => ({ ...prev, ...newAnswers }));
        // Clear errors for fields that are being updated
        setErrors(prevErrors => {
            if (Object.keys(prevErrors).length === 0) return prevErrors;

            const newErrors = { ...prevErrors };
            for (const key in newAnswers) {
                if (key === 'dimensions') {
                    delete newErrors.length;
                    delete newErrors.width;
                    delete newErrors.height;
                } else {
                     delete newErrors[key];
                }
            }
             // Only return new object if something changed to prevent re-renders
            if (Object.keys(newErrors).length !== Object.keys(prevErrors).length) {
                return newErrors;
            }
            return prevErrors;
        });
    }, []);

    useEffect(() => {
        const { roomType, maxParticipants } = answers;
        
        let newDisplayType: DisplayType = 'single';
        let newDisplayCount = 1;

        const participantCount = Number(maxParticipants) || 0;

        if (roomType === 'Huddle Space' || (participantCount > 0 && participantCount <= 6)) {
            newDisplayType = 'single';
            newDisplayCount = 1;
        } else if ((roomType === 'Conference Room' || roomType === 'Boardroom') && (participantCount > 6 && participantCount <= 16)) {
            newDisplayType = 'dual_display';
            newDisplayCount = 2;
        } else if (roomType === 'Lecture Hall' || roomType === 'Auditorium' || roomType === 'Large Venue' || participantCount > 16) {
            newDisplayType = 'projector';
            newDisplayCount = 1;
        } else if (roomType === 'Command Center') {
            newDisplayType = 'lcd_video_wall';
            newDisplayCount = 4; // Default to a 2x2
        } else if (roomType === 'Sports Bar') {
            newDisplayType = 'single';
            newDisplayCount = 8;
        } else if (roomType === 'Retail Space') {
            newDisplayType = 'single';
            newDisplayCount = 4;
        }

        if (answers.displayType !== newDisplayType || answers.displayCount !== newDisplayCount) {
            updateAnswers({
                displayType: newDisplayType,
                displayCount: newDisplayCount,
            });
        }
    }, [answers.roomType, answers.maxParticipants, answers.displayType, answers.displayCount, updateAnswers]);

    const validateStep = (stepIndex: number): boolean => {
        const newErrors: Record<string, string> = {};
        if (stepIndex === 0) { // Basic Info Validation
            if (!answers.roomName.trim()) {
                newErrors.roomName = 'Room name is required.';
            }
            if (answers.dimensions.length <= 0) {
                newErrors.length = 'Length must be > 0.';
            }
            if (answers.dimensions.width <= 0) {
                newErrors.width = 'Width must be > 0.';
            }
            if (answers.dimensions.height <= 0) {
                newErrors.height = 'Height must be > 0.';
            }
            if (answers.maxParticipants <= 0) {
                newErrors.maxParticipants = 'Participants must be > 0.';
            }
        }
        if (stepIndex === 5) { // Budget Validation
             if (answers.budget < 0) {
                newErrors.budget = 'Budget cannot be negative.';
            }
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fill in all required fields correctly.');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    };

    const handlePrev = () => {
        setErrors({}); // Clear errors when going back
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleSave = () => {
        if (!validateStep(currentStep)) return; // Validate final step before saving
        const finalRoomData: RoomData = {
            ...answers,
            id: initialData?.id || uuidv4(),
            systemDiagram: initialData?.systemDiagram,
            manuallyAddedEquipment: initialData?.manuallyAddedEquipment || [],
        };
        onSave(finalRoomData);
    };

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    return {
        currentStep,
        answers,
        errors,
        updateAnswers,
        handleNext,
        handlePrev,
        handleSave,
        isFirstStep,
        isLastStep,
    };
};