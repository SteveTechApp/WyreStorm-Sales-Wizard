import React, { useState, useCallback, useMemo } from 'react';
import { RoomData, RoomWizardAnswers } from '../utils/types';
import { createNewRoom } from '../utils/utils';
import StepBasicInfo from '../components/roomWizard/StepBasicInfo';
import StepFeatures from '../components/roomWizard/StepFeatures';
import StepTechnical from '../components/roomWizard/StepTechnical';
import StepEnvironment from '../components/roomWizard/StepEnvironment';
import StepBudget from '../components/roomWizard/StepBudget';

const STEPS = [
  { title: 'Basic Info', component: StepBasicInfo },
  { title: 'Features', component: StepFeatures },
  { title: 'Technical', component: StepTechnical },
  { title: 'Environment', component: StepEnvironment },
  { title: 'Budget', component: StepBudget },
];

interface UseRoomWizardProps {
  onSave: (roomData: RoomData) => void;
  onClose: () => void;
}

export const useRoomWizard = ({ onSave, onClose }: UseRoomWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Store the full initial RoomData object to preserve its generated ID.
  const [initialRoom] = useState(() => createNewRoom(''));
  // The wizard's 'answers' state is initialized from the full object.
  const [answers, setAnswers] = useState<RoomWizardAnswers & { customRoomType?: string }>(initialRoom);

  const handleNext = useCallback(() => {
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentStep(s => Math.max(s - 1, 0));
  }, []);
  
  const handleSave = useCallback(() => {
    // FIX: The 'id' property was missing because the 'answers' state object is typed
    // to Omit 'id'. We retrieve the 'id' from the initial full RoomData object
    // created when the wizard was initialized.
    const finalRoomData: RoomData = {
      ...answers,
      id: initialRoom.id,
      roomType: answers.roomType === 'Other' ? answers.customRoomType || 'Custom' : answers.roomType,
      functionalityStatement: '', 
      manuallyAddedEquipment: [],
    };
    // Clean up temporary property before saving
    delete (finalRoomData as any).customRoomType;
    onSave(finalRoomData);
    onClose();
  }, [answers, onSave, onClose, initialRoom.id]);

  const isNextDisabled = useMemo(() => {
    return currentStep === 0 && (!answers.roomName.trim() || (answers.roomType === 'Other' && !answers.customRoomType?.trim()));
  }, [currentStep, answers.roomName, answers.roomType, answers.customRoomType]);

  const CurrentStepComponent = STEPS[currentStep].component;

  return {
    currentStep,
    totalSteps: STEPS.length,
    answers,
    setAnswers,
    handleNext,
    handlePrev,
    handleSave,
    isNextDisabled,
    CurrentStepComponent,
  };
};