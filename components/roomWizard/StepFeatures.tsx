import React from 'react';
import { RoomWizardAnswers, Feature } from '../../utils/types';
import { COMMON_FEATURES } from '../../data/constants';

interface StepFeaturesProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepFeatures: React.FC<StepFeaturesProps> = ({ answers, updateAnswers }) => {

  const handleFeatureToggle = (featureName: string, priority: 'must-have' | 'nice-to-have') => {
    const existingFeature = answers.features.find(f => f.name === featureName);
    let newFeatures: Feature[];

    if (existingFeature) {
      if (existingFeature.priority === priority) {
        // Toggle off
        newFeatures = answers.features.filter(f => f.name !== featureName);
      } else {
        // Change priority
        newFeatures = answers.features.map(f => f.name === featureName ? { ...f, priority } : f);
      }
    } else {
      // Add new feature
      newFeatures = [...answers.features, { name: featureName, priority }];
    }
    updateAnswers({ features: newFeatures });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Select Key Features</h2>
      <p className="text-text-secondary mb-6">Choose the features this room requires. Select once for 'Nice-to-have' and again for 'Must-have'.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMMON_FEATURES.map(feature => {
          const selectedFeature = answers.features.find(f => f.name === feature.name);
          const isNice = selectedFeature?.priority === 'nice-to-have';
          const isMust = selectedFeature?.priority === 'must-have';

          return (
            <div key={feature.name} className="p-4 border rounded-lg bg-background">
              <h3 className="font-bold">{feature.name}</h3>
              <p className="text-sm text-text-secondary mb-4">{feature.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeatureToggle(feature.name, 'nice-to-have')}
                  className={`flex-1 p-2 text-sm rounded-md ${isNice || isMust ? 'bg-yellow-200 text-yellow-800' : 'bg-background-secondary hover:bg-border-color'}`}
                >
                  Nice-to-have
                </button>
                <button
                  onClick={() => handleFeatureToggle(feature.name, 'must-have')}
                  className={`flex-1 p-2 text-sm rounded-md ${isMust ? 'bg-green-200 text-green-800' : 'bg-background-secondary hover:bg-border-color'}`}
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