
import React from 'react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSave: () => void;
  isNextDisabled: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({ currentStep, totalSteps, onNext, onPrev, onSave, isNextDisabled }) => {
  return (
    <div className="mt-6 pt-4 border-t flex justify-between items-center">
      <div>
        <span className="text-sm text-gray-500">Step {currentStep + 1} of {totalSteps}</span>
      </div>
      <div className="flex gap-3">
        {currentStep > 0 && (
          <button type="button" onClick={onPrev} className="bg-background-secondary hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">
            Previous
          </button>
        )}
        {currentStep < totalSteps - 1 ? (
          <button type="button" onClick={onNext} disabled={isNextDisabled} className="bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded-md disabled:bg-gray-400">
            Next
          </button>
        ) : (
          <button type="button" onClick={onSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-6 rounded-md">
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;
