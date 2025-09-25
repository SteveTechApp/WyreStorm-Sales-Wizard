import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import ProjectWorkspace from '../components/ProjectWorkspace.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';

const DesignCoPilot: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { projectData, handleLoadProject, appState, error, setError } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (projectId && (!projectData || projectData.projectId !== projectId)) {
            handleLoadProject(projectId);
        }
    }, [projectId, projectData, handleLoadProject]);

    const handleAcknowledgeError = () => {
        setError(null);
        navigate('/');
    };

    if (appState === 'error' && error) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <ErrorDisplay 
                    error={error} 
                    onAcknowledge={handleAcknowledgeError}
                    acknowledgeButtonText="Return to Home"
                />
            </div>
        );
    }
    
    if (!projectData || projectData.projectId !== projectId) {
        return (
             <div className="flex-grow flex items-center justify-center">
                <LoadingSpinner message="Loading Project..." />
            </div>
        );
    }

    return (
        <div className="animate-fade-in flex-grow flex flex-col">
            <ProjectWorkspace project={projectData} />
        </div>
    );
};

export default DesignCoPilot;
