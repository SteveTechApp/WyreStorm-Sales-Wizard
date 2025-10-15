import React from 'react';
import { RoomWizardAnswers, Feature } from '../../utils/types.ts';
import { COMMON_FEATURES } from '../../data/wizardOptions.ts';

interface StepFeaturesProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
  errors: Record<string, string>; // Kept for consistency, not used in this step
}

const StepFeatures: React.FC<StepFeaturesProps> = ({ answers, updateAnswers }) => {

  const handleFeatureToggle = (featureName: string, priority: 'must-have' | 'nice-to-have') => {
    const existingFeature = answers.features.find(f => f.name === featureName);
    let newFeatures: Feature[];

    if (existingFeature && existingFeature.priority === priority) {
        // Toggle off if the same priority button is clicked again
        newFeatures = answers.features.filter(f => f.name !== featureName);
    } else {
        // Add or update the feature with the new priority
        const otherFeatures = answers.features.filter(f => f.name !== featureName);
        newFeatures = [...otherFeatures, { name: featureName, priority }];
    }
    updateAnswers({ features: newFeatures });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Select Key Features</h2>
      <p className="text-text-secondary mb-6">Choose the features this room requires. You can specify whether a feature is essential or just nice to have.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMMON_FEATURES.map(feature => {
          const selectedFeature = answers.features.find(f => f.name === feature.name);
          const isNice = selectedFeature?.priority === 'nice-to-have';
          const isMust = selectedFeature?.priority === 'must-have';

          return (
            <div key={feature.name} className="p-4 border rounded-lg bg-background flex flex-col justify-between">
              <div>
                <h3 className="font-bold">{feature.name}</h3>
                <p className="text-sm text-text-secondary mb-4 h-14">{feature.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeatureToggle(feature.name, 'nice-to-have')}
                  className={`flex-1 p-2 text-sm rounded-md transition-colors border ${isNice ? 'bg-blue-100 text-blue-800 font-semibold border-blue-300' : 'bg-background-secondary hover:bg-border-color border-border-color'}`}
                >
                  Nice-to-have
                </button>
                <button
                  onClick={() => handleFeatureToggle(feature.name, 'must-have')}
                  className={`flex-1 p-2 text-sm rounded-md transition-colors border ${isMust ? 'bg-accent-bg-subtle text-accent font-bold border-accent-border-subtle' : 'bg-background-secondary hover:bg-border-color border-border-color'}`}
                >
                  Must-have
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepFeatures;
