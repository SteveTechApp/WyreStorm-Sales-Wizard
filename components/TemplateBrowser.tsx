import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerationContext } from '../context/GenerationContext.tsx';
import { VERTICAL_MARKETS } from '../data/constants.ts';
import TemplateGroupCard from './TemplateGroupCard.tsx';
import { useUserTemplates } from '../hooks/useUserTemplates.ts';
import { UserTemplate } from '../utils/types.ts';
import TemplateCard from './TemplateCard.tsx';
import TemplateDetailPanel from './templateBrowser/TemplateDetailPanel.tsx';

const TemplateBrowser: React.FC = () => {
    const { handleStartFromTemplate } = useGenerationContext();
    const { userTemplates } = useUserTemplates();
    const [activeVertical, setActiveVertical] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState<UserTemplate | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedTemplate(null);
    }, [activeVertical]);

    const groupedTemplates = useMemo(() => {
        return userTemplates.reduce((acc, template) => {
            const verticalId = template.vertical;
            if (!acc[verticalId]) {
                acc[verticalId] = [];
            }
            acc[verticalId].push(template);
            return acc;
        }, {} as Record<string, UserTemplate[]>);
    }, [userTemplates]);

    const startProject = (template: UserTemplate) => {
        handleStartFromTemplate(template, navigate);
    };

    const templatesForVertical = useMemo(() => {
        if (activeVertical === 'all') return [];
        return groupedTemplates[activeVertical] || [];
    }, [activeVertical, groupedTemplates]);
    
    const filteredVerticals = useMemo(() => {
        return VERTICAL_MARKETS.filter(v => v.verticalId !== 'all' && groupedTemplates[v.verticalId]);
    }, [groupedTemplates]);

    return (
        <div>
            <div className="mb-4 overflow-x-auto">
                 <div className="flex justify-center space-x-2 border-b border-border-color">
                    {VERTICAL_MARKETS.map(v => (
                        <button 
                            key={v.verticalId}
                            onClick={() => setActiveVertical(v.verticalId)}
                            className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${activeVertical === v.verticalId ? 'border-b-2 border-accent text-accent' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            {v.name}
                        </button>
                    ))}
                 </div>
            </div>

            {activeVertical === 'all' ? (
                <div className="flex overflow-x-auto gap-6 pb-4 -mx-6 px-6 snap-x snap-mandatory">
                    {filteredVerticals.length > 0 ? filteredVerticals.map(vertical => (
                        <div key={vertical.verticalId} className="w-80 md:w-96 flex-shrink-0 snap-start">
                            <TemplateGroupCard 
                                verticalId={vertical.verticalId}
                                templates={groupedTemplates[vertical.verticalId] || []}
                                onTemplateSelect={(template) => startProject(template)}
                            />
                        </div>
                    )) : (
                        <div className="w-full flex-grow">
                            <p className="text-center text-text-secondary py-8">No templates found.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="md:col-span-1 h-[60vh] overflow-y-auto pr-2 space-y-2">
                         {templatesForVertical.length > 0 ? templatesForVertical.map(template => (
                             <TemplateCard
                                key={template.templateId}
                                template={template}
                                onSelect={setSelectedTemplate}
                                isSelected={selectedTemplate?.templateId === template.templateId}
                             />
                         )) : (
                            <p className="text-center text-text-secondary py-8">No templates found for this vertical.</p>
                         )}
                    </div>
                    <div className="md:col-span-2">
                        <TemplateDetailPanel template={selectedTemplate} onStart={startProject} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateBrowser;