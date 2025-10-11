

import React, { useMemo, useState } from 'react';
import { useGenerationContext } from '../context/GenerationContext.tsx';
import { useNavigate } from 'react-router-dom';
import { VERTICAL_MARKETS } from '../data/constants.ts';
import TemplateGroupCard from './TemplateGroupCard.tsx';
import { useUserTemplates } from '../hooks/useUserTemplates.ts';

const TemplateBrowser: React.FC = () => {
    const { handleStartFromTemplate } = useGenerationContext();
    const { userTemplates } = useUserTemplates();
    const [activeVertical, setActiveVertical] = useState('all');
    const navigate = useNavigate();

    const groupedTemplates = useMemo(() => {
        return userTemplates.reduce((acc, template) => {
            const verticalId = template.vertical; // Assuming template.vertical is the ID like 'corp', 'edu'

            if (!acc[verticalId]) {
                acc[verticalId] = [];
            }
            acc[verticalId].push(template);
            return acc;
        }, {} as Record<string, any[]>);
    }, [userTemplates]);

    const filteredVerticals = useMemo(() => {
        if (activeVertical === 'all') {
            return VERTICAL_MARKETS.filter(v => v.verticalId !== 'all' && groupedTemplates[v.verticalId]);
        }
        return VERTICAL_MARKETS.filter(v => v.verticalId === activeVertical && groupedTemplates[v.verticalId]);
    }, [activeVertical, groupedTemplates]);

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
            <div className="flex overflow-x-auto gap-6 pb-4 -mx-6 px-6 snap-x snap-mandatory">
                {filteredVerticals.length > 0 ? filteredVerticals.map(vertical => (
                    <div key={vertical.verticalId} className="w-80 md:w-96 flex-shrink-0 snap-start">
                        <TemplateGroupCard 
                            verticalId={vertical.verticalId}
                            templates={groupedTemplates[vertical.verticalId] || []}
                            onTemplateSelect={(template) => handleStartFromTemplate(template, navigate)}
                        />
                    </div>
                )) : (
                    <div className="w-full flex-grow">
                        <p className="text-center text-text-secondary py-8">No templates found for this vertical.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateBrowser;