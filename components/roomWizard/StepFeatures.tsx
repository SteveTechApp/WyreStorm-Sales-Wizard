import React from 'react';
import { RoomWizardAnswers, Feature } from '../../utils/types.ts';
import { COMMON_FEATURES } from '../../data/wizardOptions.ts';
import FeatureCard from './FeatureCard.tsx';

interface StepFeaturesProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
  errors: Record<string, string>;
}

const StepFeatures: React.FC<StepFeaturesProps> = ({ answers, updateAnswers }) => {

  const handleFeatureToggle = (featureName: string, priority: 'must-have' | 'nice-to-have') => {
    const { features } = answers;
    const existing = features.find(f => f.name === featureName);
    let newFeatures: Feature[];

    if (existing && existing.priority === priority) {
        newFeatures = features.filter(f => f.name !== featureName);
    } else {
        const otherFeatures = features.filter(f => f.name !== featureName);
        newFeatures = [...otherFeatures, { name: featureName, priority }];
    }
    updateAnswers({ features: newFeatures });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Key Features</h2>
      <p className="text-text-secondary mb-6">Specify if a feature is essential or just nice to have.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMMON_FEATURES.map(feature => (
          <FeatureCard
            key={feature.name}
            name={feature.name}
            description={feature.description}
            selectedFeature={answers.features.find(f => f.name === feature.name)}
            onToggle={handleFeatureToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default StepFeatures;
