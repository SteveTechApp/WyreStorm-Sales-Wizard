import React from 'react';
import { RoomData } from '../utils/types';
import WizardNavigation from './roomWizard/WizardNavigation';
import { useRoomWizard } from '../hooks/useRoomWizard';

interface RoomWizardProps {
  onSave: (roomData: RoomData) => void;
  onClose: () => void;
}

const RoomWizard: React.FC<RoomWizardProps> = ({ onSave, onClose }) => {
  const {
    currentStep,
    totalSteps,
    answers,
    setAnswers,
    handleNext,
    handlePrev,
    handleSave,
    isNextDisabled,
    CurrentStepComponent,
  } = useRoomWizard({ onSave, onClose });

  return (
    <div className="p-6">
      <div className="min-h-[400px]">
        <CurrentStepComponent answers={answers} setAnswers={setAnswers} />
      </div>
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrev={handlePrev}
        onSave={handleSave}
        isNextDisabled={isNextDisabled}
      />
    </div>
  );
};

export default RoomWizard;