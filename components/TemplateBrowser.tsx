import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { VERTICAL_MARKETS } from '../data/constants';
import TemplateGroupCard, { TemplateGroup } from './TemplateGroupCard';
import { useNavigate } from 'react-router-dom';
import { UserTemplate } from '../utils/types';

const TemplateBrowser: React.FC = () => {
    const { userTemplates, handleCreateProjectFromTemplate, handleDeleteTemplate } = useAppContext();
    const [activeTab, setActiveTab] = useState(VERTICAL_MARKETS[0].verticalId);
    const navigate = useNavigate();

    const activeVerticalName = VERTICAL_MARKETS.find(v => v.verticalId === activeTab)?.name;

    const templateGroups = useMemo(() => {
        if (!activeVerticalName) return [];

        const filteredTemplates = userTemplates.filter(t => t.vertical === activeVerticalName);
        const groups: Record<string, Partial<TemplateGroup>> = {};

        filteredTemplates.forEach(template => {
            const groupName = template.templateName.replace(/\s\((Bronze|Silver|Gold)\)$/, '');
            if (!groups[groupName]) {
                groups[groupName] = {
                    groupName,
                    vertical: template.vertical,
                    imageUrl: template.imageUrl,
                    description: template.description.split('.')[0] + '.'
                };
            }
            if (template.templateName.includes('Bronze')) groups[groupName].bronze = template;
            if (template.templateName.includes('Silver')) groups[groupName].silver = template;
            if (template.templateName.includes('Gold')) groups[groupName].gold = template;
        });
        
        return Object.values(groups).filter(g => g.bronze || g.silver || g.gold) as TemplateGroup[];
    }, [userTemplates, activeVerticalName]);
    
    const handleCreateProject = (template: UserTemplate) => {
        handleCreateProjectFromTemplate(template, navigate);
    };

    const handleDeleteGroup = (group: TemplateGroup) => {
        if (window.confirm(`Are you sure you want to delete all templates for "${group.groupName}"?`)) {
            if (group.bronze) handleDeleteTemplate(group.bronze.templateId);
            if (group.silver) handleDeleteTemplate(group.silver.templateId);
            if (group.gold) handleDeleteTemplate(group.gold.templateId);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-text-primary mb-3 text-center sm:text-left">Start from a Template</h2>
            <div className="flex-shrink-0 border-b border-border-color">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                    {VERTICAL_MARKETS.map(vertical => (
                        <button
                            key={vertical.verticalId}
                            onClick={() => setActiveTab(vertical.verticalId)}
                            className={`py-2 px-3 text-sm font-semibold whitespace-nowrap border-b-2 ${
                                activeTab === vertical.verticalId
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            {vertical.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-grow pt-4 overflow-hidden">
                 {templateGroups.length > 0 ? (
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {templateGroups.map(group => (
                             <div key={group.groupName} className="w-72 flex-shrink-0">
                                <TemplateGroupCard
                                    group={group}
                                    onCreateProject={handleCreateProject}
                                    onDeleteGroup={handleDeleteGroup}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-text-secondary h-full">
                        <p>No templates available for this vertical market.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateBrowser;
