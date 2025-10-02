import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext.tsx';
import { formatDistanceToNow } from 'date-fns';

const RecentProjects: React.FC = () => {
  const { savedProjects, handleDeleteProject } = useProjectContext();
  const navigate = useNavigate();

  const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).slice(0, 5);

  const handleLoad = (projectId: string) => {
    navigate(`/design/${projectId}`);
  };

  return (
    <div className="bg-background-secondary p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
      {sortedProjects.length > 0 ? (
        <ul className="space-y-3">
          {sortedProjects.map(project => (
            <li key={project.projectId} className="group flex justify-between items-center p-3 bg-background rounded-md">
              <div>
                <button onClick={() => handleLoad(project.projectId)} className="font-semibold text-left hover:text-accent">{project.projectName}</button>
                <p className="text-xs text-text-secondary">
                    Last saved: {formatDistanceToNow(new Date(project.lastSaved), { addSuffix: true })}
                </p>
              </div>
              <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.projectId);
                  }}
                  className="text-destructive opacity-0 group-hover:opacity-100 text-sm font-semibold"
                >
                  Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm text-text-secondary py-4">No recent projects found.</p>
      )}
    </div>
  );
};

export default RecentProjects;
