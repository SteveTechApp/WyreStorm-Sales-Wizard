import React from 'react';
import { useRoomWizard } from '../hooks/useRoomWizard.ts';
import { RoomData } from '../utils/types.ts';
import InfoModal from './InfoModal.tsx';
import WizardNavigation from './roomWizard/WizardNavigation.tsx';
import StepBasicInfo from './roomWizard/StepBasicInfo.tsx';
import StepOutputs from './roomWizard/StepOutputs.tsx';
import StepInputs from './roomWizard/StepInputs.tsx';
import StepAudio from './roomWizard/StepAudio.tsx';
import StepFeatures from './roomWizard/StepFeatures.tsx';
import StepEnvironment from './roomWizard/StepEnvironment.tsx';
import StepAVoIPNetwork from './roomWizard/StepAVoIPNetwork.tsx';
import StepBudget from './roomWizard/StepBudget.tsx';

interface RoomWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: RoomData) => void;
  initialData: RoomData | null;
}

const stepComponents = [
  { title: 'Basic Info', component: StepBasicInfo },
  { title: 'Output Designer', component: StepOutputs },
  { title: 'Source Designer', component: StepInputs },
  { title: 'Features', component: StepFeatures },
  { title: 'Audio', component: StepAudio },
  { title: 'Environment & Control', component: StepEnvironment },
  { title: 'AVoIP Network', component: StepAVoIPNetwork },
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
  } = useRoomWizard(initialData, onSave, stepComponents.length);

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