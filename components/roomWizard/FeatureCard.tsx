import React from 'react';
import { Feature } from '../../utils/types.ts';

interface FeatureCardProps {
  name: string;
  description: string;
  selectedFeature?: Feature;
  onToggle: (featureName: string, priority: 'must-have' | 'nice-to-have') => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ name, description, selectedFeature, onToggle }) => {
  const isNice = selectedFeature?.priority === 'nice-to-have';
  const isMust = selectedFeature?.priority === 'must-have';

  const getButtonClass = (isActive: boolean, isMustButton: boolean) => {
    if (isActive) {
        return isMustButton
            ? 'bg-accent-bg-subtle text-accent font-bold border-accent-border-subtle shadow-md shadow-accent/20 ring-1 ring-accent'
            : 'bg-blue-100 text-blue-800 font-semibold border-blue-300';
    }
    return 'bg-background-secondary hover:bg-border-color border-border-color';
  };

  return (
    <div className="p-4 border rounded-lg bg-background flex flex-col justify-between">
      <div>
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-text-secondary mb-4 h-14">{description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onToggle(name, 'nice-to-have')}
          className={`flex-1 p-2 text-sm rounded-md transition-colors border ${getButtonClass(isNice, false)}`}
        >
          Nice-to-have
        </button>
        <button
          onClick={() => onToggle(name, 'must-have')}
          className={`flex-1 p-2 text-sm rounded-md transition-all duration-200 border ${getButtonClass(isMust, true)}`}
        >
          Must-have
        </button>
      </div>
    </div>
  );
};

export default FeatureCard;
