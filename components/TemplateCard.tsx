import React from 'react';
import { UserTemplate } from '../utils/types.ts';
import InfoTooltip from './InfoTooltip.tsx';

interface TemplateCardProps {
  template: UserTemplate;
  onSelect: (template: UserTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const mustHaveFeatures = template.roomData.features.filter(f => f.priority === 'must-have');

  const templateOverview = (
    <div className="text-left">
      <p><span className="font-bold">Room Type:</span> {template.roomData.roomType}</p>
      <p><span className="font-bold">Tier:</span> {template.roomData.designTier}</p>
      <p><span className="font-bold">Capacity:</span> {template.roomData.maxParticipants} people</p>
      {mustHaveFeatures.length > 0 && (
        <>
          <p className="font-bold mt-2">Must-Have Features:</p>
          <ul className="list-disc list-inside">
            {mustHaveFeatures.map(f => (
              <li key={f.name}>{f.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <InfoTooltip content={templateOverview}>
      <button
        onClick={() => onSelect(template)}
        className="w-full text-left p-2 rounded-md hover:bg-border-color transition-colors"
      >
        <p className="font-semibold">{template.templateName}</p>
        <p className="text-xs text-text-secondary">{template.description}</p>
      </button>
    </InfoTooltip>
  );
};

export default TemplateCard;
