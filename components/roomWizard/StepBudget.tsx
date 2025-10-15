import React from 'react';
import { RoomWizardAnswers } from '../../utils/types.ts';
import DesignTierSelector from './basicInfo/DesignTierSelector.tsx';

interface StepBudgetProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
  errors: Record<string, string>;
}

const StepBudget: React.FC<StepBudgetProps> = ({ answers, updateAnswers }) => {
  return (
    <div className="space-y-8">
      <DesignTierSelector answers={answers} updateAnswers={updateAnswers} />
    </div>
  );
};

export default StepBudget;
