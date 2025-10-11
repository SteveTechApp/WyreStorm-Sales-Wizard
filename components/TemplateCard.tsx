import React from 'react';
import { UserTemplate } from '../utils/types.ts';

interface TemplateCardProps {
  template: UserTemplate;
  onSelect: (template: UserTemplate) => void;
  isSelected?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, isSelected }) => {
  return (
    <button
      onClick={() => onSelect(template)}
      className={`w-full text-left p-2 rounded-md transition-colors border ${
        isSelected
          ? 'bg-accent/10 border-accent'
          : 'bg-background hover:bg-border-color border-border-color'
      }`}
    >
      <p className="font-semibold">{template.templateName}</p>
      <p className="text-xs text-text-secondary">{template.description}</p>
    </button>
  );
};

export default TemplateCard;