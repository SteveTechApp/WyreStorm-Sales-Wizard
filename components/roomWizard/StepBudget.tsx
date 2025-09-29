import React from 'react';
import { RoomWizardAnswers } from '../../utils/types.ts';
import { useUserContext } from '../../context/UserContext.tsx';

interface StepBudgetProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepBudget: React.FC<StepBudgetProps> = ({ answers, updateAnswers }) => {
  const { userProfile } = useUserContext();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Budget</h2>
      <p className="text-text-secondary mb-6">Specify the target budget for this room's equipment and installation. This helps the AI select appropriate products.</p>
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-text-secondary">Target Budget ({userProfile.currency})</label>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{userProfile.currency === 'GBP' ? '£' : userProfile.currency === 'USD' ? '$' : '€'}</span>
          </div>
          <input
            type="number"
            id="budget"
            value={answers.budget}
            onChange={(e) => updateAnswers({ budget: Number(e.target.value) })}
            className="w-full p-2 pl-7 border rounded-md bg-input-bg"
            placeholder="5000"
          />
        </div>
      </div>
    </div>
  );
};

export default StepBudget;
