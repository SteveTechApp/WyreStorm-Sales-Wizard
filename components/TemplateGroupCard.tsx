import React from 'react';
import { UserTemplate } from '../utils/types';
import { TrashIcon } from './Icons';

export interface TemplateGroup {
    groupName: string;
    vertical: string;
    imageUrl?: string;
    description?: string;
    bronze?: UserTemplate;
    silver?: UserTemplate;
    gold?: UserTemplate;
}

interface TemplateGroupCardProps {
    group: TemplateGroup;
    onCreateProject: (template: UserTemplate) => void;
    onDeleteGroup: (group: TemplateGroup) => void;
}

const TIER_STYLES = {
    Bronze: { color: 'bg-[#cd7f32]', hoverColor: 'hover:bg-[#a76828]' },
    Silver: { color: 'bg-gray-400', hoverColor: 'hover:bg-gray-500' },
    Gold: { color: 'bg-yellow-400', hoverColor: 'hover:bg-yellow-500' },
};

const TemplateGroupCard: React.FC<TemplateGroupCardProps> = ({ group, onCreateProject, onDeleteGroup }) => {
    return (
        <div className="bg-background-secondary rounded-lg border border-border-color flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            {group.imageUrl && (
                <img src={group.imageUrl} alt={group.groupName} className="w-full h-40 object-cover" />
            )}
            <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-lg font-bold text-text-primary">{group.groupName}</h2>
                <p className="text-sm text-text-secondary flex-grow mt-1 mb-4">{group.description || 'No description available.'}</p>
                
                <div className="relative flex justify-center items-center mt-auto pt-4 border-t border-border-color">
                    <button 
                        onClick={() => onDeleteGroup(group)} 
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-text-secondary hover:text-destructive rounded-full hover:bg-background" 
                        title="Delete Template Group"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        {group.bronze && (
                            <div className="relative group">
                                <button
                                    onClick={() => onCreateProject(group.bronze!)}
                                    className={`w-8 h-8 rounded-full ${TIER_STYLES.Bronze.color} ${TIER_STYLES.Bronze.hoverColor} text-white font-bold text-xs flex items-center justify-center shadow-md transition-colors`}
                                    aria-label="Create project from Bronze template"
                                >
                                    B
                                </button>
                                <div className="absolute bottom-full mb-2 w-64 p-3 bg-background text-text-primary text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                                    <p className="font-bold">Bronze Tier</p>
                                    <p>{group.bronze.description}</p>
                                </div>
                            </div>
                        )}
                         {group.silver && (
                            <div className="relative group">
                                <button
                                    onClick={() => onCreateProject(group.silver!)}
                                    className={`w-8 h-8 rounded-full ${TIER_STYLES.Silver.color} ${TIER_STYLES.Silver.hoverColor} text-white font-bold text-xs flex items-center justify-center shadow-md transition-colors`}
                                    aria-label="Create project from Silver template"
                                >
                                    S
                                </button>
                                <div className="absolute bottom-full mb-2 w-64 p-3 bg-background text-text-primary text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                                    <p className="font-bold">Silver Tier</p>
                                    <p>{group.silver.description}</p>
                                </div>
                            </div>
                        )}
                         {group.gold && (
                            <div className="relative group">
                                <button
                                    onClick={() => onCreateProject(group.gold!)}
                                    className={`w-8 h-8 rounded-full ${TIER_STYLES.Gold.color} ${TIER_STYLES.Gold.hoverColor} text-white font-bold text-xs flex items-center justify-center shadow-md transition-colors`}
                                    aria-label="Create project from Gold template"
                                >
                                    G
                                </button>
                                <div className="absolute bottom-full mb-2 w-64 p-3 bg-background text-text-primary text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                                    <p className="font-bold">Gold Tier</p>
                                    <p>{group.gold.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateGroupCard;