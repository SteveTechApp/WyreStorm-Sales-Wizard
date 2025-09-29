import { useState, useEffect } from 'react';
import { RoomData, RoomWizardAnswers } from '../utils/types.ts';
import { createNewRoom } from '../utils/utils.ts';
import { v4 as uuidv4 } from 'uuid';

const createInitialAnswers = (initialData: RoomData | null): RoomWizardAnswers => {
    if (initialData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, systemDiagram, ...rest } = initialData;
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

const TOTAL_STEPS = 5; // Basic Info, Features, Environment, Technical, Budget

export const useRoomWizard = (initialData: RoomData | null, onSave: (roomData: RoomData) => void) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<RoomWizardAnswers>(() => createInitialAnswers(initialData));

    useEffect(() => {
        setAnswers(createInitialAnswers(initialData));
    }, [initialData]);

    const updateAnswers = (newAnswers: Partial<RoomWizardAnswers>) => {
        setAnswers(prev => ({ ...prev, ...newAnswers }));
    };

    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleSave = () => {
        const finalRoomData: RoomData = {
            ...answers,
            id: initialData?.id || uuidv4(),
            systemDiagram: initialData?.systemDiagram,
        };
        onSave(finalRoomData);
    };

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === TOTAL_STEPS - 1;

    return {
        currentStep,
        answers,
        updateAnswers,
        handleNext,
        handlePrev,
        handleSave,
        isFirstStep,
        isLastStep,
    };
};
