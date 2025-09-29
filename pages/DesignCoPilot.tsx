import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext.tsx';
// FIX: Corrected import path
import ProjectWorkspace from '../components/ProjectWorkspace.tsx';
import ProjectEmptyState from '../components/ProjectEmptyState.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';

const DesignCoPilot: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { projectData, handleLoadProject, error, appState } = useProjectContext();
    
    useEffect(() => {
        if (projectId && projectData?.projectId !== projectId) {
            handleLoadProject(projectId);
        }
    }, [projectId, projectData, handleLoadProject]);

    // This handles the case where the project ID in the URL is invalid and not found.
    useEffect(() => {
        if (error) {
            setTimeout(() => navigate('/'), 3000); // Redirect home after 3 seconds
        }
    }, [error, navigate]);


    if (error) {
        return <ErrorDisplay message={error} onRetry={() => navigate('/')} />;
    }

    if (!projectData || projectData.projectId !== projectId || appState === 'loading') {
        return <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    if (projectData.rooms.length === 0) {
        return <ProjectEmptyState />;
    }

    return <ProjectWorkspace />;
};

export default DesignCoPilot;
