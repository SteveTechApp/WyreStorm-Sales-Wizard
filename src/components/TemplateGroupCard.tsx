import React from 'react';
import { UserTemplate } from '@/utils/types';
import { VERTICAL_MARKETS } from '@/data/constants';

interface TemplateGroupCardProps {
  verticalId: string;
  templates: UserTemplate[];
  onTemplateSelect: (template: UserTemplate) => void;
}

const TemplateGroupCard: React.FC<TemplateGroupCardProps> = ({ verticalId, templates, onTemplateSelect }) => {
  const verticalInfo = VERTICAL_MARKETS.find(v => v.verticalId === verticalId);

  if (!verticalInfo || templates.length === 0) return null;
  
  const Icon = verticalInfo.icon;

  return (
    <div className="bg-background border border-border-color rounded-lg overflow-hidden">
      <div className="p-4 flex items-center gap-3 bg-background-secondary border-b border-border-color">
        <Icon className="h-6 w-6 text-accent" />
        <h3 className="font-bold text-lg text-text-primary">{verticalInfo.name}</h3>
      </div>
      <div className="p-4 space-y-2">
        {templates.map(template => (
          <button
            key={template.templateId}
            onClick={() => onTemplateSelect(template)}
            className="w-full text-left p-2 rounded-md hover:bg-border-color"
          >
            <p className="font-semibold">{template.templateName}</p>
            <p className="text-xs text-text-secondary">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateGroupCard;
