import React from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { UserTemplate } from '../utils/types.ts';
import { TrashIcon } from './Icons.tsx';
import TierIcon from './TierIcon.tsx';

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

const TemplateGroupCard: React.FC<TemplateGroupCardProps> = ({ group, onCreateProject, onDeleteGroup }) => {
    return (
        <div className="bg-background-secondary rounded-lg border border-border-color flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full relative group/card">
            {/* Background Image */}
            <img 
                src={group.imageUrl} 
                alt={group.groupName} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110" 
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 transition-colors duration-300 group-hover/card:bg-slate-900/70"></div>

            <div className="relative p-2 flex-grow flex flex-col text-white">
                <h2 className="text-lg font-bold text-slate-100">{group.groupName}</h2>
                <p className="text-sm text-slate-300 flex-grow mt-1 mb-2">{group.description || 'No description available.'}</p>
                
                <div className="relative flex justify-center items-center mt-auto pt-2 border-t border-slate-500/50">
                    <button 
                        onClick={() => onDeleteGroup(group)} 
                        className="absolute left-1 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-destructive rounded-full hover:bg-black/20" 
                        title="Delete Template Group"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {group.bronze && (
                            <div className="relative group/tooltip">
                                <button
                                    onClick={() => onCreateProject(group.bronze!)}
                                    className="p-1 rounded-full bg-transparent hover:bg-black/20 transition-colors"
                                    aria-label="Create project from Bronze template"
                                >
                                    <TierIcon tier="Bronze" className="h-9 w-9" />
                                </button>
                                <div className="absolute bottom-full mb-2 w-56 p-3 bg-background text-text-primary text-sm rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                                    <p className="font-bold">Bronze Tier</p>
                                    <p>{group.bronze.description}</p>
                                </div>
                            </div>
                        )}
                         {group.silver && (
                            <div className="relative group/tooltip">
                                <button
                                    onClick={() => onCreateProject(group.silver!)}
                                    className="p-1 rounded-full bg-transparent hover:bg-black/20 transition-colors"
                                    aria-label="Create project from Silver template"
                                >
                                    <TierIcon tier="Silver" className="h-9 w-9" />
                                </button>
                                <div className="absolute bottom-full mb-2 w-56 p-3 bg-background text-text-primary text-sm rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                                    <p className="font-bold">Silver Tier</p>
                                    <p>{group.silver.description}</p>
                                </div>
                            </div>
                        )}
                         {group.gold && (
                            <div className="relative group/tooltip">
                                <button
                                    onClick={() => onCreateProject(group.gold!)}
                                    className="p-1 rounded-full bg-transparent hover:bg-black/20 transition-colors"
                                    aria-label="Create project from Gold template"
                                >
                                    <TierIcon tier="Gold" className="h-9 w-9" />
                                </button>
                                <div className="absolute bottom-full mb-2 w-56 p-3 bg-background text-text-primary text-sm rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
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