import React from 'react';
import { useProjectContext } from '../context/ProjectContext.tsx';
import RecentProjectCard from './welcome/RecentProjectCard.tsx';

const RecentProjects: React.FC = () => {
  const { savedProjects } = useProjectContext();

  const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).slice(0, 6);

  return (
    <div className="bg-background-secondary p-4 rounded-xl shadow-xl h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">Recent Projects</h2>
      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-y-auto">
          {sortedProjects.map(project => (
            <RecentProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-text-secondary py-8">No recent projects found.</p>
      )}
    </div>
  );
};

export default RecentProjects;