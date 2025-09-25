import React from 'react';
import { RoomWizardAnswers } from '../../utils/types';
// FIX: Correct relative path and add file extension to satisfy module resolution
import { useAppContext } from '../../context/AppContext.tsx';

interface StepProps {
    answers: RoomWizardAnswers;
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
}

const StepBudget: React.FC<StepProps> = ({ answers, setAnswers }) => {
    const { userProfile } = useAppContext();
    const currencySymbol = userProfile?.currency === 'USD' ? '$' : userProfile?.currency === 'EUR' ? '€' : '£';
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswers(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }));
    };

    return (
        <section className="animate-fade-in-fast space-y-6">
            <h3 className="font-semibold text-lg text-gray-700">Budget (Optional)</h3>
            <p className="text-sm text-gray-500">
                Providing an approximate hardware budget helps the AI select appropriately priced equipment for the chosen design tier.
            </p>
            <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Target Hardware Budget ({userProfile?.currency})
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{currencySymbol}</span>
                    </div>
                    <input
                        type="number"
                        name="budget"
                        id="budget"
                        className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        value={answers.budget || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </section>
    );
};

export default StepBudget;