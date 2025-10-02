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
            const vertical = template.vertical;
            const verticalId = VERTICAL_MARKETS.find(v => v.name === vertical)?.verticalId || 'other';

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
        <div className="bg-background-secondary p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-4">Start from a Template</h2>
            <div className="mb-4 overflow-x-auto">
                 <div className="flex space-x-2 border-b border-border">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVerticals.map(vertical => (
                    <TemplateGroupCard 
                        key={vertical.verticalId}
                        verticalId={vertical.verticalId}
                        templates={groupedTemplates[vertical.verticalId] || []}
                        onTemplateSelect={(template) => handleStartFromTemplate(template, navigate)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TemplateBrowser;
