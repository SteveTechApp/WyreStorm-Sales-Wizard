import React from 'react';
import { useRoomWizard } from '../hooks/useRoomWizard.ts';
import { RoomData } from '../utils/types.ts';
import InfoModal from './InfoModal.tsx';
import WizardNavigation from './roomWizard/WizardNavigation.tsx';
import StepBasicInfo from './roomWizard/StepBasicInfo.tsx';
import StepDisplay from './roomWizard/StepDisplay.tsx';
import StepSources from './roomWizard/StepSources.tsx';
import StepAudio from './roomWizard/StepAudio.tsx';
import StepEnvironment from './roomWizard/StepEnvironment.tsx';
import StepBudget from './roomWizard/StepBudget.tsx';

interface RoomWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: RoomData) => void;
  initialData: RoomData | null;
}

const stepComponents = [
  { title: 'Basic Info', component: StepBasicInfo },
  { title: 'Display', component: StepDisplay },
  { title: 'Sources', component: StepSources },
  { title: 'Audio', component: StepAudio },
  { title: 'Environment & Control', component: StepEnvironment },
  { title: 'Budget & Tier', component: StepBudget },
];

const STEPS = stepComponents.map(s => s.title);

const RoomWizard: React.FC<RoomWizardProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const {
    currentStep,
    answers,
    errors,
    updateAnswers,
    handleNext,
    handlePrev,
    handleSave,
    isFirstStep,
    isLastStep,
  } = useRoomWizard(initialData, onSave);

  if (!isOpen) return null;

  const renderStepContent = () => {
    const StepComponent = stepComponents[currentStep].component;
    return <StepComponent answers={answers} updateAnswers={updateAnswers} errors={errors} />;
  };

  const title = (
    <div>
      <h2 className="text-2xl font-bold text-text-primary">Room Configuration Wizard</h2>
      <p className="text-sm text-text-secondary">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</p>
    </div>
  );

  const footer = (
    <WizardNavigation
      onNext={handleNext}
      onPrev={handlePrev}
      onSave={handleSave}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      onClose={onClose}
    />
  );

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-4xl" title={title} footer={footer}>
      {renderStepContent()}
    </InfoModal>
  );
};

export default RoomWizard;