import React from 'react';
import { RoomWizardAnswers, Feature } from '../../utils/types';
import { COMMON_FEATURES } from '../../data/constants';

interface StepProps {
    answers: RoomWizardAnswers;
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
}

const StepFeatures: React.FC<StepProps> = ({ answers, setAnswers }) => {

    const handleFeatureToggle = (featureName: string) => {
        setAnswers(prev => {
            const existingFeature = prev.features.find(f => f.name === featureName);
            if (existingFeature) {
                return { ...prev, features: prev.features.filter(f => f.name !== featureName) };
            } else {
                return { ...prev, features: [...prev.features, { name: featureName, priority: 'must-have' }] };
            }
        });
    };

    const handlePriorityChange = (featureName: string, priority: 'must-have' | 'nice-to-have') => {
        setAnswers(prev => ({
            ...prev,
            features: prev.features.map(f => f.name === featureName ? { ...f, priority } : f)
        }));
    };

    return (
        <section className="animate-fade-in-fast">
            <h3 className="font-semibold text-lg text-gray-700 mb-3">Features</h3>
            <div className="space-y-3">
                {COMMON_FEATURES.map(featureName => {
                    const feature = answers.features.find(f => f.name === featureName);
                    return (
                        <div key={featureName} className={`p-3 border rounded-md transition-colors ${feature ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={!!feature} onChange={() => handleFeatureToggle(featureName)} className="h-5 w-5 rounded text-green-600 focus:ring-green-500 border-gray-300" />
                                    <span className="font-medium text-gray-800">{featureName}</span>
                                </label>
                                {feature && (
                                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-0.5">
                                        <button onClick={() => handlePriorityChange(featureName, 'must-have')} className={`px-3 py-1 text-xs rounded-full ${feature.priority === 'must-have' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}>Must Have</button>
                                        <button onClick={() => handlePriorityChange(featureName, 'nice-to-have')} className={`px-3 py-1 text-xs rounded-full ${feature.priority === 'nice-to-have' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>Nice to Have</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default StepFeatures;
