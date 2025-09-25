import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import { UserTemplate } from '../utils/types';
import TemplateGroupCard, { TemplateGroup } from './TemplateGroupCard';
import { VERTICAL_MARKETS } from '../data/constants';
import TierIcon from './TierIcon.tsx';
import RotarySwitch from './cockpit/RotarySwitch.tsx';
import RockerSwitch from './cockpit/RockerSwitch.tsx';

const TemplateBrowser: React.FC = () => {
    const { userTemplates, handleCreateProjectFromTemplate, handleDeleteTemplate, t, theme } = useAppContext();
    const navigate = useNavigate();
    const [selectedVertical, setSelectedVertical] = useState<string>('All');
    const [selectedGroup, setSelectedGroup] = useState<TemplateGroup | null>(null);

    const templateGroups = useMemo((): TemplateGroup[] => {
        const groups: Record<string, TemplateGroup> = {};

        const filteredTemplates = selectedVertical.includes('All')
            ? userTemplates
            : userTemplates.filter(t => selectedVertical === t.vertical);

        filteredTemplates.forEach(template => {
            const groupName = template.templateName.replace(/\s\((Bronze|Silver|Gold)\)$/, '');
            
            if (!groups[groupName]) {
                const verticalMarket = VERTICAL_MARKETS.find(v => v.name === template.vertical);
                const firstTemplateDescription = filteredTemplates.find(t => t.templateName.startsWith(groupName))?.description || 'A versatile room solution.';

                groups[groupName] = { 
                    groupName, 
                    vertical: template.vertical, 
                    imageUrl: template.imageUrl || verticalMarket?.imageUrl,
                    description: firstTemplateDescription
                };
            }

            if (template.templateName.toLowerCase().includes('bronze')) {
                groups[groupName].bronze = template;
            } else if (template.templateName.toLowerCase().includes('silver')) {
                groups[groupName].silver = template;
            } else if (template.templateName.toLowerCase().includes('gold')) {
                groups[groupName].gold = template;
            }
        });

        const sortedGroups = Object.values(groups).sort((a, b) => a.groupName.localeCompare(b.groupName));
        
        // Auto-select first group if selection is lost after filtering
        if (selectedGroup && !sortedGroups.some(g => g.groupName === selectedGroup.groupName)) {
            setSelectedGroup(sortedGroups.length > 0 ? sortedGroups[0] : null);
        } else if (!selectedGroup && sortedGroups.length > 0) {
             setSelectedGroup(sortedGroups[0]);
        }

        return sortedGroups;
    }, [userTemplates, selectedVertical]);
    
    // Effect to auto-select the first item when the filter changes
    React.useEffect(() => {
        if (templateGroups.length > 0) {
            const currentSelectionStillExists = templateGroups.some(g => g.groupName === selectedGroup?.groupName);
            if (!currentSelectionStillExists) {
                setSelectedGroup(templateGroups[0]);
            }
        } else {
            setSelectedGroup(null);
        }
    }, [templateGroups, selectedGroup]);


    const handleDeleteGroup = (group: TemplateGroup) => {
        if (window.confirm(`Are you sure you want to delete all templates for "${group.groupName}"?`)) {
            if(group.bronze) handleDeleteTemplate(group.bronze.templateId);
            if(group.silver) handleDeleteTemplate(group.silver.templateId);
            if(group.gold) handleDeleteTemplate(group.gold.templateId);
        }
    };

    const handleCreate = (template: UserTemplate) => {
        handleCreateProjectFromTemplate(template, navigate);
    };

    const verticals = ['All', ...[...new Set(VERTICAL_MARKETS.map(v => v.name))]];

    if (theme === 'cockpit') {
        return (
            <div className="bg-slate-800 p-2 rounded-lg border-2 border-slate-700 h-full flex flex-col font-mono">
                <h2 className="text-sm font-bold text-accent uppercase tracking-widest text-center mb-2 flex-shrink-0">Mission Selector</h2>
                <div className="grid grid-cols-2 gap-2 flex-grow min-h-0">
                    {/* Left Column: Sector Dial */}
                    <div className="flex items-center justify-center">
                       <RotarySwitch
                            options={verticals}
                            value={selectedVertical}
                            onChange={(v) => setSelectedVertical(v)}
                            label="Sector"
                        />
                    </div>
                    {/* Right Column: Mission Selection */}
                    <div className="flex flex-col gap-2 min-h-0">
                        <div className="flex-grow bg-black/50 p-1 rounded-md border-2 border-slate-900 shadow-inner shadow-black overflow-y-auto">
                           {templateGroups.map(group => (
                               <RockerSwitch
                                    key={group.groupName}
                                    label={group.groupName}
                                    isActive={selectedGroup?.groupName === group.groupName}
                                    onToggle={() => setSelectedGroup(group)}
                                />
                           ))}
                        </div>
                        {selectedGroup ? (
                            <div className="flex-shrink-0 bg-black/50 p-3 rounded-md border-2 border-slate-900 shadow-inner shadow-black">
                                <p className="text-xs text-primary/70 h-10">{selectedGroup.description}</p>
                                <div className="mt-2 pt-2 border-t-2 border-primary/20 flex items-center justify-around">
                                    {selectedGroup.bronze && <button onClick={() => handleCreate(selectedGroup.bronze!)} className="p-1 rounded-full hover:bg-slate-700" title="Launch Bronze"><TierIcon tier="Bronze" className="h-7 w-7" /></button>}
                                    {selectedGroup.silver && <button onClick={() => handleCreate(selectedGroup.silver!)} className="p-1 rounded-full hover:bg-slate-700" title="Launch Silver"><TierIcon tier="Silver" className="h-7 w-7" /></button>}
                                    {selectedGroup.gold && <button onClick={() => handleCreate(selectedGroup.gold!)} className="p-1 rounded-full hover:bg-slate-700" title="Launch Gold"><TierIcon tier="Gold" className="h-7 w-7" /></button>}
                                </div>
                            </div>
                        ) : <div className="h-[88px] flex-shrink-0"></div>}
                    </div>
                </div>
            </div>
        )
    }

    // Default Theme Browser
    const [selectedVerticals, setSelectedVerticals] = useState<string[]>(['All']);
    const handleVerticalSelection = (vertical: string) => {
        if (vertical === 'All') { setSelectedVerticals(['All']); return; }
        setSelectedVerticals(prev => {
            const withoutAll = prev.filter(v => v !== 'All');
            const isSelected = withoutAll.includes(vertical);
            if (isSelected) {
                const newSelection = withoutAll.filter(v => v !== vertical);
                return newSelection.length === 0 ? ['All'] : newSelection;
            } else { return [...withoutAll, vertical]; }
        });
    };
    const defaultThemeTemplateGroups = useMemo(() => {
         const groups: Record<string, TemplateGroup> = {};
        (selectedVerticals.includes('All')
            ? userTemplates
            : userTemplates.filter(t => selectedVerticals.includes(t.vertical))
        ).forEach(template => {
            const groupName = template.templateName.replace(/\s\((Bronze|Silver|Gold)\)$/, '');
            if (!groups[groupName]) {
                const verticalMarket = VERTICAL_MARKETS.find(v => v.name === template.vertical);
                groups[groupName] = { groupName, vertical: template.vertical, imageUrl: template.imageUrl || verticalMarket?.imageUrl, description: template.description };
            }
            if (template.templateName.toLowerCase().includes('bronze')) groups[groupName].bronze = template;
            else if (template.templateName.toLowerCase().includes('silver')) groups[groupName].silver = template;
            else if (template.templateName.toLowerCase().includes('gold')) groups[groupName].gold = template;
        });
        return Object.values(groups);
    }, [userTemplates, selectedVerticals]);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold text-text-primary mb-3 font-display">{t('welcome.startFromTemplate', 'Start from a Template')}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-border-color mb-4 pb-2">
                {verticals.map(vertical => (
                    <label key={vertical} className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary">
                        <input type="checkbox" checked={selectedVerticals.includes(vertical)} onChange={() => handleVerticalSelection(vertical)} className="h-4 w-4 rounded text-primary focus:ring-primary border-border-color bg-background" />
                        <span className="font-medium">{vertical}</span>
                    </label>
                ))}
            </div>
            {defaultThemeTemplateGroups.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {defaultThemeTemplateGroups.map(group => (
                        <TemplateGroupCard key={group.groupName} group={group} onCreateProject={handleCreate} onDeleteGroup={handleDeleteGroup} />
                    ))}
                </div>
            ) : (
                <div className="bg-background-secondary p-8 rounded-lg border border-border-color text-center text-text-secondary">
                    <p>{t('templates.noTemplates', 'No templates available for this vertical market.')}</p>
                </div>
            )}
        </div>
    );
};

export default TemplateBrowser;