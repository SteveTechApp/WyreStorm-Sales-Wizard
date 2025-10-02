import React from 'react';
import { UserTemplate } from '../utils/types';
import { VERTICAL_MARKETS } from '../data/constants';

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
    <div className="bg-background border border-border-color rounded-lg overflow-hidden flex flex-col">
      <div className="relative group">
        <img src={verticalInfo.imageUrl} alt={verticalInfo.name} className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-white" />
            <h3 className="font-bold text-lg text-white drop-shadow-md">{verticalInfo.name}</h3>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2 flex-grow">
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
