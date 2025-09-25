import React from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
import { BuildingIcon, TrashIcon } from './Icons';

const RecentProjects: React.FC = () => {
    const { savedProjects, handleLoadProject, handleDeleteProject, t } = useAppContext();
    const navigate = useNavigate();

    const onProjectClick = (projectId: string) => {
        handleLoadProject(projectId);
        navigate(`/design/${projectId}`);
    };
    
    const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).slice(0, 5);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4 font-display">{t('welcome.recentProjects', 'Recent Projects')}</h2>
            <div className="bg-background-secondary p-2 sm:p-4 rounded-lg border border-border-color">
                {sortedProjects.length > 0 ? (
                    <ul className="divide-y divide-border-color">
                        {sortedProjects.map(project => (
                            <li key={project.projectId} className="flex items-center justify-between p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-lg hover:bg-background transition-colors group">
                                <button onClick={() => onProjectClick(project.projectId)} className="flex items-center gap-4 text-left flex-grow min-w-0">
                                    <BuildingIcon className="h-6 w-6 text-text-secondary flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-bold text-text-primary truncate">{project.projectName}</p>
                                        <p className="text-sm text-text-secondary truncate">
                                            {project.clientName} &bull; Last saved: {new Date(project.lastSaved).toLocaleString()}
                                        </p>
                                    </div>
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.projectId); }}
                                    className="p-2 text-text-secondary/60 hover:text-destructive hover:bg-destructive/10 rounded-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete project"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-text-secondary py-8">{t('welcome.noRecentProjects', 'You have no recent projects. Create a new one to get started!')}</p>
                )}
            </div>
        </div>
    );
};

export default RecentProjects;