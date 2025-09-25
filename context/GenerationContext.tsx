


import React, { createContext, useContext, ReactNode } from 'react';
import useProjectGeneration from '../hooks/useProjectGeneration.ts';
// FIX: Add file extension to satisfy module resolution for types.ts
import { UserTemplate, IncomingRequest, ProjectData } from '../utils/types.ts';
import { NavigateFunction } from 'react-router-dom';
import { useProjectContext } from './ProjectContext.tsx';
import { useUserContext } from './UserContext.tsx';

// Define the shape of the context value based on the return type of the useProjectGeneration hook
interface GenerationContextType {
    handleGenerateProposal: (projectData: ProjectData, navigate: NavigateFunction) => Promise<void>;
    handleAgentSubmit: (documentText: string, navigate: NavigateFunction) => Promise<void>;
    userTemplates: UserTemplate[];
    handleSaveTemplate: (template: UserTemplate) => void;
    handleDeleteTemplate: (templateId: string) => void;
    handleStartFromTemplate: (templateName: string, navigate: NavigateFunction) => void;
    handleCreateProjectFromTemplate: (template: UserTemplate, navigate: NavigateFunction, projectDetails?: { projectName: string; clientName: string; }) => void;
    handleAcceptRequest: (request: IncomingRequest, navigate: NavigateFunction) => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export const GenerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userProfile } = useUserContext();
    const { setAppState, setError, setLoadingContext, dispatchProjectAction } = useProjectContext();
    
    // Pass the required state setters and dispatch function to the hook
    const generationData = useProjectGeneration(
        userProfile, 
        setAppState, 
        setError, 
        setLoadingContext, 
        dispatchProjectAction
    );

    return (
        <GenerationContext.Provider value={generationData}>
            {children}
        </GenerationContext.Provider>
    );
};

export const useGenerationContext = () => {
    const context = useContext(GenerationContext);
    if (context === undefined) {
        throw new Error('useGenerationContext must be used within a GenerationProvider');
    }
    return context;
};