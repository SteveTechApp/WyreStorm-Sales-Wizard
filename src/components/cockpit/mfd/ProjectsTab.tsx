import React from 'react';
import { useProjectContext } from '@/context/ProjectContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ProjectsTab: React.FC = () => {
    const { savedProjects } = useProjectContext();
    const navigate = useNavigate();

    const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).slice(0, 5);

    return (
        <div className="text-sm">
            <p>&gt; QUERY: RECENT_SORTIES</p>
            <p>&gt; ACCESSING_DATABASE...</p>
            <p className="text-white">&gt; {sortedProjects.length} ENTRIES FOUND.</p>
            <br />
            {sortedProjects.map(p => (
                <div key={p.projectId} className="mb-2">
                    <button onClick={() => navigate(`/design/${p.projectId}`)} className="hover:bg-accent/10 w-full text-left">
                        <p className="font-bold text-white">:: {p.projectName}</p>
                    </button>
                    <p className="pl-4"> CLIENT: {p.clientName}</p>
                    <p className="pl-4"> LAST_MOD: {formatDistanceToNow(new Date(p.lastSaved), { addSuffix: true })}</p>
                </div>
            ))}
             {sortedProjects.length === 0 && <p className="text-text-secondary mt-4">// NO SORTIES FOUND IN DATABASE.</p>}
        </div>
    );
};

export default ProjectsTab;
