import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext.tsx';
import { formatDistanceToNow } from 'date-fns';

const RecentProjects: React.FC = () => {
  const { savedProjects, handleDeleteProject } = useProjectContext();
  const navigate = useNavigate();

  const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).slice(0, 6);

  const handleLoad = (projectId: string) => {
    navigate(`/design/${projectId}`);
  };

  return (
    <div className="bg-background-secondary p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProjects.map(project => (
            <div key={project.projectId} className="bg-background p-4 rounded-lg border border-border-color flex flex-col justify-between group">
              <div>
                <h3 className="font-bold text-lg">{project.projectName}</h3>
                <p className="text-sm text-text-secondary mb-1">Client: {project.clientName}</p>
                <p className="text-xs text-text-secondary">
                    Saved: {formatDistanceToNow(new Date(project.lastSaved), { addSuffix: true })}
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                 <button onClick={() => handleLoad(project.projectId)} className="font-semibold text-accent hover:underline text-sm">
                    Load Project
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.projectId);
                  }}
                  className="text-destructive opacity-0 group-hover:opacity-100 text-xs font-semibold"
                >
                  Delete
              </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-text-secondary py-8">No recent projects found.</p>
      )}
    </div>
  );
};

export default RecentProjects;