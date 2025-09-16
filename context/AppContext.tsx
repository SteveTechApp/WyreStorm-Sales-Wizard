import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, Proposal, UserProfile, RoomData, Feature, IncomingRequest, ProjectSetupData } from '../utils/types';
import { generateProposal, analyzeRequirements, generateInspiredRoomDesign } from '../services/geminiService';
import { createDefaultRoomData } from '../utils/utils';

type AppState = 'idle' | 'generating-proposal' | 'error';

interface AppContextType {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    projectData: ProjectData | null;
    setProjectData: React.Dispatch<React.SetStateAction<ProjectData | null>>;
    proposal: Proposal | null;
    error: string | null;
    userProfile: UserProfile | null;
    isProfileRemembered: boolean;
    savedProjects: ProjectData[];
    isProfileModalOpen: boolean;
    setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loadingContext: 'template' | 'proposal' | null;
    isInitialLoadComplete: boolean;
    favouritedClients: string[];
    incomingRequests: IncomingRequest[];
    isUserAvailable: boolean;
    handleSaveUserProfile: (profile: UserProfile, rememberMe: boolean) => void;
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
    handleSetAvailability: (isAvailable: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appState, setAppState] = useState<AppState>('idle');
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isProfileRemembered, setIsProfileRemembered] = useState(false);
    const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [loadingContext, setLoadingContext] = useState<'template' | 'proposal' | null>(null);
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
    const [favouritedClients, setFavouritedClients] = useState<string[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
    const [isUserAvailable, setIsUserAvailable] = useState(true);

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                setUserProfile(JSON.parse(savedProfile));
                setIsProfileRemembered(true);
            } else {
                setIsProfileModalOpen(true);
            }
            const projects = localStorage.getItem('savedProjects');
            if (projects) setSavedProjects(JSON.parse(projects));
            const favClients = localStorage.getItem('favouritedClients');
            if (favClients) setFavouritedClients(JSON.parse(favClients));
            const requests = localStorage.getItem('incomingRequests');
            if (requests) setIncomingRequests(JSON.parse(requests));
            const availability = localStorage.getItem('isUserAvailable');
            if (availability) setIsUserAvailable(JSON.parse(availability));
        } catch (e) {
            console.error("Failed to load data from localStorage", e);
        } finally {
            setIsInitialLoadComplete(true);
        }
    }, []);

    useEffect(() => {
        if (!isUserAvailable || favouritedClients.length === 0 || !isInitialLoadComplete) return;
        const lastCheck = localStorage.getItem('lastRequestCheck');
        const now = Date.now();
        if (lastCheck && now - parseInt(lastCheck) < 30000) return;
        localStorage.setItem('lastRequestCheck', now.toString());
        const hasPendingTentative = incomingRequests.some(r => r.status === 'tentative');
        if (!hasPendingTentative && Math.random() > 0.5) {
            const randomFavClient = favouritedClients[Math.floor(Math.random() * favouritedClients.length)];
            const newRequest: IncomingRequest = {
                requestId: uuidv4(),
                clientName: randomFavClient,
                description: 'New Conference Room Design & Quote',
                status: 'tentative',
                createdAt: Date.now(),
            };
            const updatedRequests = [...incomingRequests, newRequest];
            setIncomingRequests(updatedRequests);
            localStorage.setItem('incomingRequests', JSON.stringify(updatedRequests));
        }
    }, [isUserAvailable, favouritedClients, incomingRequests, isInitialLoadComplete]);

    const handleSaveUserProfile = (profile: UserProfile, rememberMe: boolean) => {
        try {
            setUserProfile(profile);
            setIsProfileRemembered(rememberMe);
            if (rememberMe) localStorage.setItem('userProfile', JSON.stringify(profile));
            else localStorage.removeItem('userProfile');
        } catch (e) {
            setError("Could not save profile. The logo image might be too large.");
        }
    };

    const handleSaveProject = (data: ProjectData) => {
        const updatedData = { ...data, lastSaved: new Date().toISOString() };
        setSavedProjects(prev => {
            const existingIndex = prev.findIndex(p => p.projectId === updatedData.projectId);
            const newProjects = [...prev];
            if (existingIndex > -1) newProjects[existingIndex] = updatedData;
            else newProjects.push(updatedData);
            localStorage.setItem('savedProjects', JSON.stringify(newProjects));
            return newProjects;
        });
        setProjectData(updatedData);
    };

    const handleNewProject = useCallback(() => {
        setProjectData(null);
        setProposal(null);
        setAppState('idle');
    }, []);

    const handleProjectSetupSubmit = (setupData: ProjectSetupData, navigate: (path: string) => void) => {
        const newProject: ProjectData = {
            ...setupData,
            projectId: uuidv4(),
            lastSaved: new Date().toISOString(),
            rooms: setupData.rooms.map(r => ({ ...createDefaultRoomData(), ...r, id: uuidv4() })),
            status: 'draft',
        };
        setProjectData(newProject);
        navigate(`/design/${newProject.projectId}`);
    };
    
    const handleAgentSubmit = async (text: string, navigate: (path: string) => void) => {
        setLoadingContext('template');
        setAppState('generating-proposal');
        try {
            const requirements = await analyzeRequirements(text, userProfile);
            const newProject: ProjectData = {
                ...requirements,
                projectId: uuidv4(),
                lastSaved: new Date().toISOString(),
                rooms: requirements.rooms.map(r => {
                    const featuresAsObjects: Feature[] = (r.features || []).map(name => ({ name, priority: 'must-have' }));
                    return { ...createDefaultRoomData(), ...r, id: uuidv4(), features: featuresAsObjects };
                }),
                status: 'draft',
            };
            setProjectData(newProject);
            setAppState('idle');
            navigate(`/design/${newProject.projectId}`);
        } catch(e: any) {
            setError(`Failed to analyze document: ${e.message}`);
            setAppState('error');
        }
    };

    const handleGenerateProposal = async (data: ProjectData, navigate: (path: string) => void) => {
        setLoadingContext('proposal');
        setAppState('generating-proposal');
        const finalProjectData = { ...data, status: 'complete' as const };
        handleSaveProject(finalProjectData);
        setProjectData(finalProjectData);
        try {
            const generatedProposal = await generateProposal(finalProjectData, userProfile);
            setProposal(generatedProposal);
            setAppState('idle');
            navigate(`/proposal/${finalProjectData.projectId}`);
        } catch (e: any) {
            setError(`The AI failed to generate the proposal. Error: ${e.message}`);
            setAppState('error');
        }
    };

    const handleDeleteProject = (projectId: string) => {
        const newProjects = savedProjects.filter(p => p.projectId !== projectId);
        setSavedProjects(newProjects);
        localStorage.setItem('savedProjects', JSON.stringify(newProjects));
    };

    const handleLoadProject = (projectId: string, navigate: (path: string) => void) => {
        const projectToLoad = savedProjects.find(p => p.projectId === projectId);
        if (projectToLoad) {
            setProjectData(projectToLoad);
            setProposal(null); // Clear old proposal
            navigate(`/design/${projectToLoad.projectId}`);
        }
    };
    
    const handleStartFromTemplate = async (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', templateName: string, participantCount: number, navigate: (path: string) => void) => {
        setLoadingContext('template');
        setAppState('generating-proposal');
        try {
            const inspiredRoom = await generateInspiredRoomDesign(templateName, roomType, designTier, participantCount, userProfile?.unitSystem || 'imperial');
            const newProject: ProjectData = {
                projectId: uuidv4(),
                projectName: `${templateName} Project`,
                clientName: userProfile?.company || 'My Company',
                lastSaved: new Date().toISOString(),
                rooms: [{ ...createDefaultRoomData(), ...inspiredRoom, id: uuidv4() }],
                status: 'draft',
            };
            setProjectData(newProject);
            setAppState('idle');
            navigate(`/design/${newProject.projectId}`);
        } catch (e: any) {
            setError(`Failed to generate from template: ${e.message}`);
            setAppState('error');
        }
    };
    
    const handleToggleFavouriteClient = (clientName: string) => {
        setFavouritedClients(prev => {
            const newFavs = prev.includes(clientName) ? prev.filter(c => c !== clientName) : [...prev, clientName];
            localStorage.setItem('favouritedClients', JSON.stringify(newFavs));
            return newFavs;
        });
    };

    const handleConfirmRequest = async (requestId: string, navigate: (path: string) => void) => {
        const request = incomingRequests.find(r => r.requestId === requestId);
        if (!request) return;
        setLoadingContext('template');
        setAppState('generating-proposal');
        try {
            const inspiredRoom = await generateInspiredRoomDesign('Huddle / Small Meeting Room (2-6)', 'Conference Room', 'Silver', 6, userProfile?.unitSystem || 'imperial');
            const newProject: ProjectData = {
                projectId: uuidv4(),
                projectName: `${request.clientName} - New Request`,
                clientName: request.clientName,
                lastSaved: new Date().toISOString(),
                rooms: [{ ...createDefaultRoomData(), ...inspiredRoom, id: uuidv4() }],
                status: 'draft',
            };
            handleSaveProject(newProject);
            setProjectData(newProject);
            setAppState('idle');
            const updatedRequests = incomingRequests.filter(r => r.requestId !== requestId);
            setIncomingRequests(updatedRequests);
            localStorage.setItem('incomingRequests', JSON.stringify(updatedRequests));
            navigate(`/design/${newProject.projectId}`);
        } catch (e: any) {
            setError(`Failed to create project from request: ${e.message}`);
            setAppState('error');
        }
    };

    const handleRejectRequest = (requestId: string) => {
        const updatedRequests = incomingRequests.filter(r => r.requestId !== requestId);
        setIncomingRequests(updatedRequests);
        localStorage.setItem('incomingRequests', JSON.stringify(updatedRequests));
    };

    const handleSetAvailability = (isAvailable: boolean) => {
        setIsUserAvailable(isAvailable);
        localStorage.setItem('isUserAvailable', JSON.stringify(isAvailable));
    };

    const value = {
        appState, setAppState, projectData, setProjectData, proposal, error, userProfile, isProfileRemembered,
        savedProjects, isProfileModalOpen, setIsProfileModalOpen, loadingContext, isInitialLoadComplete,
        favouritedClients, incomingRequests, isUserAvailable, handleSaveUserProfile, handleSaveProject,
        handleNewProject, handleProjectSetupSubmit, handleAgentSubmit, handleGenerateProposal,
        handleDeleteProject, handleLoadProject, handleStartFromTemplate, handleToggleFavouriteClient,
        handleConfirmRequest, handleRejectRequest, handleSetAvailability
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