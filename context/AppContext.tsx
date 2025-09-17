
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectData, Proposal, UserProfile, IncomingRequest, ProjectSetupData, ThemeName } from '../utils/types';
import { useProjectManagement } from '../hooks/useProjectManagement';
import { useProjectGeneration } from '../hooks/useProjectGeneration';
import { useClientRequests } from '../hooks/useClientRequests';
import { useUserProfile } from '../hooks/useUserProfile';
import { themes } from '../data/themes';

type AppState = 'idle' | 'generating-proposal' | 'error';

interface AppContextType {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    projectData: ProjectData | null;
    error: string | null;
    userProfile: UserProfile;
    savedProjects: ProjectData[];
    isQuickQuestionModalOpen: boolean;
    setIsQuickQuestionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loadingContext: 'template' | 'proposal' | null;
    isInitialLoadComplete: boolean;
    favouritedClients: string[];
    incomingRequests: IncomingRequest[];
    isProfileModalOpen: boolean;
    setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    theme: ThemeName;
    handleSetTheme: (theme: ThemeName) => void;
    handleSaveUserProfile: (profile: UserProfile) => void;
    handleSaveProject: (data: ProjectData) => void;
    handleNewProject: () => void;
    handleProjectSetupSubmit: (setupData: ProjectSetupData, navigate: (path: string) => void) => void;
    handleAgentSubmit: (text: string, navigate: (path: string) => void) => Promise<void>;
    handleGenerateProposal: (data: ProjectData, navigate: (path: string) => void) => Promise<void>;
    handleDeleteProject: (projectId: string) => void;
    handleLoadProject: (projectId: string, navigate: (path: string) => void) => void;
    handleStartFromTemplate: (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', templateName: string, participantCount: number, navigate: (path: string) => void) => Promise<void>;
    handleToggleFavouriteClient: (clientName: string) => void;
    handleConfirmRequest: (requestId: string, navigate: (path: string) => void) => Promise<void>;
    handleRejectRequest: (requestId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
    const [isQuickQuestionModalOpen, setIsQuickQuestionModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    const { userProfile, handleSaveUserProfile } = useUserProfile(isInitialLoadComplete);
    const theme = userProfile.theme;
    
    useEffect(() => {
        const themeObject = themes[theme] || themes.wyrestorm;
        const themeStyleTag = document.getElementById('app-theme');
        if (themeStyleTag) {
            const css = `:root { ${Object.entries(themeObject).map(([key, value]) => `${key}: ${value};`).join(' ')} }`;
            themeStyleTag.innerHTML = css;
        }
        document.body.className = 'bg-background text-text-primary transition-colors duration-300';
    }, [theme]);
    
    const handleSetTheme = (newTheme: ThemeName) => {
        handleSaveUserProfile({ ...userProfile, theme: newTheme });
    };

    const projectManagementData = useProjectManagement(isInitialLoadComplete, userProfile);
    
    const generationData = useProjectGeneration(
        userProfile,
        projectManagementData.handleSaveProject
    );

    const clientRequestData = useClientRequests(
        isInitialLoadComplete,
        userProfile,
        projectManagementData.handleSaveProject,
        generationData.handleStartFromTemplate
    );

    useEffect(() => {
        setIsInitialLoadComplete(true);
    }, []);

    const value: AppContextType = {
        isInitialLoadComplete,
        userProfile,
        handleSaveUserProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        theme,
        handleSetTheme,
        ...projectManagementData,
        ...generationData,
        ...clientRequestData,
        isQuickQuestionModalOpen,
        setIsQuickQuestionModalOpen,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};