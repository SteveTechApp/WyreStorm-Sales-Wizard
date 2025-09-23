import React from 'react';
import { RoomWizardAnswers } from '../../utils/types';
import { COMMON_FEATURES } from '../../data/constants';

interface StepProps {
    answers: RoomWizardAnswers;
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
}

const StepFeatures: React.FC<StepProps> = ({ answers, setAnswers }) => {

    const handleFeatureToggle = (featureName: string) => {
        setAnswers(prev => {
            const isSelected = prev.features.some(f => f.name === featureName);
            if (isSelected) {
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
            <h3 className="font-semibold text-lg text-gray-700 mb-1">Select Required Features</h3>
            <p className="text-sm text-gray-500 mb-4">Click on a feature to add it to the room. Then, specify if it's a must-have or nice-to-have.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COMMON_FEATURES.map(featureInfo => {
                    const feature = answers.features.find(f => f.name === featureInfo.name);
                    const isSelected = !!feature;

                    return (
                        <div 
                            key={featureInfo.name} 
                            onClick={() => handleFeatureToggle(featureInfo.name)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col ${isSelected ? 'border-primary bg-primary/5' : 'border-border-color bg-card hover:border-primary/50'}`}
                        >
                            <h4 className="font-bold text-text-primary text-sm">{featureInfo.name}</h4>
                            <p className="text-xs text-text-secondary mt-1 flex-grow">{featureInfo.description}</p>
                            
                            {isSelected && (
                                <div className="mt-4 pt-3 border-t border-border-color/50 animate-fade-in-fast">
                                    <p className="text-xs font-semibold text-text-secondary mb-2">Priority:</p>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handlePriorityChange(featureInfo.name, 'must-have'); }} 
                                            className={`w-full text-xs font-semibold py-1 px-2 rounded-md transition-colors ${feature.priority === 'must-have' ? 'bg-destructive text-white shadow' : 'bg-background-secondary hover:bg-destructive/10'}`}
                                        >
                                            Must Have
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handlePriorityChange(featureInfo.name, 'nice-to-have'); }} 
                                            className={`w-full text-xs font-semibold py-1 px-2 rounded-md transition-colors ${feature.priority === 'nice-to-have' ? 'bg-primary text-text-on-accent shadow' : 'bg-background-secondary hover:bg-primary/10'}`}
                                        >
                                            Nice to Have
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default StepFeatures;