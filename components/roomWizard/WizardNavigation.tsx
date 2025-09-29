import React from 'react';

interface WizardNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  onSave: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onClose: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({ onNext, onPrev, onSave, isFirstStep, isLastStep, onClose }) => {
  return (
    <div className="mt-8 flex justify-between items-center border-t border-border-color pt-4">
      <div>
        <button onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">
          Cancel
        </button>
      </div>
      <div className="flex gap-4">
        <button onClick={onPrev} disabled={isFirstStep} className="bg-background-secondary hover:bg-border-color font-bold py-2 px-4 rounded-lg disabled:opacity-50">
          Previous
        </button>
        {isLastStep ? (
          <button onClick={onSave} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg">
            Save Changes
          </button>
        ) : (
          <button onClick={onNext} className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;