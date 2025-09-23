import React from 'react';
import { ProjectData } from '../utils/types';

interface RecentProjectsProps {
    savedProjects: ProjectData[];
    onSelectProject: (projectId: string) => void;
    onDeleteProject: (projectId: string) => void;
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ savedProjects, onSelectProject, onDeleteProject }) => {
    return (
        <div className="bg-background-secondary p-4 rounded-lg border border-border-color">
            <h2 className="text-xl font-bold text-text-primary mb-3">Recent Projects</h2>
            {savedProjects && savedProjects.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {savedProjects.map((p: ProjectData) => (
                        <div key={p.projectId} className="flex justify-between items-center p-2 bg-card rounded-md border border-border-color">
                            <div>
                                <p className="font-semibold text-text-primary text-sm">{p.projectName}</p>
                                <p className="text-xs text-text-secondary">{p.clientName} - Last saved: {new Date(p.lastSaved).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onSelectProject(p.projectId)} className="text-xs bg-primary/20 text-primary font-semibold py-1 px-2 rounded-md hover:bg-primary/30">Open</button>
                                <button onClick={() => onDeleteProject(p.projectId)} className="text-xs bg-destructive/20 text-destructive font-semibold py-1 px-2 rounded-md hover:bg-destructive/30">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">
                     <p>You have no recent projects.</p>
                </div>
            )}
        </div>
    );
}

export default RecentProjects;
