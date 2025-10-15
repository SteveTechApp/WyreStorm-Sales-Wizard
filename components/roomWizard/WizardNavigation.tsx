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
    <div className="flex justify-between items-center w-full">
      {/* Left: Previous Button */}
      <div className="flex-1 text-left">
        {!isFirstStep && (
          <button
            onClick={onPrev}
            className="btn btn-secondary py-2 px-4"
          >
            Previous
          </button>
        )}
      </div>

      {/* Center: Cancel Button */}
      <div className="flex-1 text-center">
        <button onClick={onClose} className="text-destructive font-medium py-2 px-4 rounded-md hover:bg-destructive-bg transition-colors">
          Cancel
        </button>
      </div>
      
      {/* Right: Next or Save Button */}
      <div className="flex-1 text-right">
        {isLastStep ? (
          <button onClick={onSave} className="btn btn-accent py-2 px-6">
            Save Changes
          </button>
        ) : (
          <button onClick={onNext} className="btn btn-primary py-2 px-6">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;