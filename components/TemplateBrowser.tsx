import React, { useMemo } from 'react';
import { useUserTemplates } from '../hooks/useUserTemplates.ts';
import { UserTemplate } from '../utils/types.ts';
import TemplateCard from './TemplateCard.tsx';
import { ArrowUturnLeftIcon } from './Icons.tsx';

interface TemplateBrowserProps {
  onTemplateSelect: (template: UserTemplate) => void;
  activeVertical: string;
  onBack: () => void;
}

const TemplateBrowser: React.FC<TemplateBrowserProps> = ({ onTemplateSelect, activeVertical, onBack }) => {
    const { userTemplates, handleDeleteTemplate } = useUserTemplates();

    const filteredTemplates = useMemo(() => {
        return userTemplates.filter(t => t.vertical === activeVertical);
    }, [userTemplates, activeVertical]);

    return (
        <div>
            <div className="mb-6">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                    <ArrowUturnLeftIcon className="h-4 w-4" />
                    Back to All Verticals
                </button>
            </div>

            {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredTemplates.map(template => (
                        <TemplateCard
                            key={template.templateId}
                            template={template}
                            onSelect={onTemplateSelect}
                            onDelete={handleDeleteTemplate}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-text-secondary py-16">
                    <p className="font-semibold">No templates found.</p>
                    <p className="text-sm mt-1">No templates available for this vertical market.</p>
                </div>
            )}
        </div>
    );
};

export default TemplateBrowser;
