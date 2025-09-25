import React, { createContext, useContext, ReactNode } from 'react';
// FIX: Add file extension to satisfy module resolution
import { useProjectManagement } from '../hooks/useProjectManagement.ts';
import { useUserContext } from './UserContext.tsx';
// FIX: Add file extension to satisfy module resolution for types.ts
import { Product, ProjectData, ProjectSetupData } from '../utils/types.ts';
import { NavigateFunction } from 'react-router-dom';

interface ProjectContextType {
    projectData: ProjectData | null;
    dispatchProjectAction: React.Dispatch<any>;
    savedProjects: ProjectData[];
    handleLoadProject: (projectId: string) => void;
    handleDeleteProject: (projectId: string) => void;
    handleNewProjectClick: (navigate: NavigateFunction) => void;
    handleProjectSetupSubmit: (setupData: ProjectSetupData, navigate: NavigateFunction) => void;
    productDatabase: Product[];
    appState: string;
    setAppState: React.Dispatch<React.SetStateAction<string>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    loadingContext: 'template' | 'proposal' | null;
    setLoadingContext: React.Dispatch<React.SetStateAction<'template' | 'proposal' | null>>;
    comparisonList: Product[];
    toggleComparison: (product: Product) => void;
    clearComparison: () => void;
    undoProjectState: () => void;
    redoProjectState: () => void;
    canUndoProject: boolean;
    canRedoProject: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userProfile } = useUserContext();
    const projectManagementData = useProjectManagement(userProfile);
    return (
        <ProjectContext.Provider value={projectManagementData}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjectContext must be used within a ProjectProvider');
    }
    return context;
};