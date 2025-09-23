import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { VERTICAL_MARKETS } from '../data/constants';
import TemplateGroupCard, { TemplateGroup } from '../components/TemplateGroupCard';
import { UserTemplate } from '../utils/types';

const TemplatesByVerticalPage: React.FC = () => {
    const { verticalId } = useParams<{ verticalId: string }>();
    const navigate = useNavigate();
    const { userTemplates, handleCreateProjectFromTemplate, handleDeleteTemplate } = useAppContext();

    const vertical = VERTICAL_MARKETS.find(v => v.verticalId === verticalId);

    const templateGroups = useMemo(() => {
        if (!vertical) return [];

        const filteredTemplates = userTemplates.filter(t => t.vertical === vertical.name);
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
        
        return Object.values(groups) as TemplateGroup[];
    }, [userTemplates, vertical]);
    
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

    if (!vertical) {
        return <div className="p-8 text-center text-destructive">Vertical market not found.</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
            <header className="mb-6">
                <Link to="/" className="text-sm text-primary hover:underline mb-2 inline-block">&larr; Back to Home</Link>
                <h1 className="text-3xl font-bold font-display text-text-primary">{vertical.name} Templates</h1>
            </header>
            
            {templateGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templateGroups.map(group => (
                        <TemplateGroupCard 
                            key={group.groupName}
                            group={group} 
                            onCreateProject={handleCreateProject}
                            onDeleteGroup={handleDeleteGroup}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-text-secondary">
                    <p>No templates available for this vertical market.</p>
                </div>
            )}
        </div>
    );
};

export default TemplatesByVerticalPage;
