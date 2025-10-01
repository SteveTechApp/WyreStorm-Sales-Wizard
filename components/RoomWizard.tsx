import React, { useEffect } from 'react';
import { useRoomWizard } from '../hooks/useRoomWizard.ts';
import { RoomData } from '../utils/types.ts';

import WizardNavigation from './roomWizard/WizardNavigation.tsx';
import StepBasicInfo from './roomWizard/StepBasicInfo.tsx';
import StepFeatures from './roomWizard/StepFeatures.tsx';
import StepTechnical from './roomWizard/StepTechnical.tsx';
import StepEnvironment from './roomWizard/StepEnvironment.tsx';
import StepBudget from './roomWizard/StepBudget.tsx';

interface RoomWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: RoomData) => void;
  initialData: RoomData | null;
}

const STEPS = ['Basic Info', 'Features', 'Environment', 'Technical', 'Budget'];

const RoomWizard: React.FC<RoomWizardProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const {
    currentStep,
    answers,
    updateAnswers,
    handleNext,
    handlePrev,
    handleSave,
    isFirstStep,
    isLastStep,
  } = useRoomWizard(initialData, onSave);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepBasicInfo answers={answers} updateAnswers={updateAnswers} />;
      case 1:
        return <StepFeatures answers={answers} updateAnswers={updateAnswers} />;
      case 2:
        return <StepEnvironment answers={answers} updateAnswers={updateAnswers} />;
      case 3:
        return <StepTechnical answers={answers} updateAnswers={updateAnswers} />;
      case 4:
        return <StepBudget answers={answers} updateAnswers={updateAnswers} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-border">
          <h2 className="text-2xl font-bold text-text-primary">Room Configuration Wizard</h2>
          <p className="text-sm text-text-secondary">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</p>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          {renderStepContent()}
        </div>
        <WizardNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          onSave={handleSave}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default RoomWizard;