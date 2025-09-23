import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NavigateFunction } from 'react-router-dom';
import { ProjectData, UserProfile, UserTemplate, IncomingRequest, RoomData, Proposal } from '../utils/types';
import { useUserTemplates } from './useUserTemplates';
import { generateProposal } from '../services/proposalService';
import { analyzeRequirements } from '../services/projectAnalysisService';
import { createNewRoom } from '../utils/utils';

// FIX: Added userProfile as a parameter to the hook to provide a stable context for the callbacks.
const useProjectGeneration = (
    userProfile: UserProfile | null,
    setAppState: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setLoadingContext: React.Dispatch<React.SetStateAction<'template' | 'proposal' | null>>,
    dispatchProjectAction: React.Dispatch<any>
) => {
    const { userTemplates, handleSaveTemplate, handleDeleteTemplate } = useUserTemplates();

    // FIX: Removed userProfile from signature; it's now accessed from the hook's scope.
    const handleGenerateProposal = useCallback(async (projectData: ProjectData, navigate: NavigateFunction) => {
        if (!userProfile) return;
        setLoadingContext('proposal');
        setAppState('generating');
        setError(null);
        try {
            const proposalContent = await generateProposal(projectData, userProfile);
            const newProposal: Proposal = {
                ...proposalContent,
                proposalId: uuidv4(),
                version: (projectData.proposals?.length || 0) + 1,
                createdAt: new Date().toISOString()
            };

            const updatedProject = { ...projectData, proposals: [...projectData.proposals, newProposal] };
            dispatchProjectAction({ type: 'UPDATE_PROJECT', payload: updatedProject });
            navigate(`/proposal/${projectData.projectId}/${newProposal.proposalId}`);
        } catch (e: any) {
            console.error(e);
            setError(`Failed to generate proposal: ${e.message}`);
            setAppState('error');
        } finally {
            setLoadingContext(null);
            if (setAppState) setAppState('idle');
        }
    }, [setAppState, setError, setLoadingContext, dispatchProjectAction, userProfile]);

    // FIX: Removed userProfile from signature.
    const handleAgentSubmit = useCallback(async (documentText: string, navigate: NavigateFunction) => {
        if (!userProfile) return;
        setLoadingContext('template');
        setAppState('generating');
        setError(null);
        try {
            const setupData = await analyzeRequirements(documentText, userProfile);
            
            const roomsWithDefaults: RoomData[] = setupData.rooms.map((room: any) => ({
                ...createNewRoom(room.roomName),
                ...room, // overwrite defaults with analyzed data
                // Ensure display details from AI are used
                displayCount: room.displayCount || 1,
                displayType: room.displayType || 'Display Not Specified',
            }));

            const newProject: ProjectData = {
                projectId: uuidv4(),
                projectName: setupData.projectName,
                clientName: setupData.clientName,
                lastSaved: new Date().toISOString(),
                proposals: [],
                unitSystem: userProfile.unitSystem,
                notes: `Project generated from client brief on ${new Date().toLocaleDateString()}.`,
                rooms: roomsWithDefaults,
                productDatabase: [],
                ancillaryCosts: { cables: 0, connectors: 0, containment: 0, fixings: 0, materials: 0 }
            };

            dispatchProjectAction({ type: 'LOAD_PROJECT', payload: newProject });
            navigate(`/design/${newProject.projectId}`);

        } catch (e: any) {
            console.error(e);
            setError(`Failed to analyze document: ${e.message}`);
            setAppState('error');
        } finally {
            setLoadingContext(null);
            if (setAppState) setAppState('idle');
        }
    }, [setAppState, setError, setLoadingContext, userProfile, dispatchProjectAction]);
    
    const handleStartFromTemplate = useCallback((templateName: string, navigate: NavigateFunction) => {
        console.log("handleStartFromTemplate called with:", templateName);
        navigate('/setup');
    }, []);

    // REFACTORED to create project immediately and navigate to designer
    // FIX: Update function signature to accept optional projectDetails and use them when creating the new project.
    const handleCreateProjectFromTemplate = useCallback((template: UserTemplate, navigate: NavigateFunction, projectDetails?: { projectName: string, clientName: string }) => {
        if (!userProfile) return;
        setLoadingContext('template');
        setAppState('generating'); 
        
        setTimeout(() => {
            try {
                const baseProjectName = template.templateName.replace(/\s\((Bronze|Silver|Gold)\)$/, '');
                const newProject: ProjectData = {
                    projectId: uuidv4(),
                    projectName: projectDetails?.projectName || `${baseProjectName} Project`,
                    clientName: projectDetails?.clientName || 'New Client', // Placeholder client name
                    lastSaved: new Date().toISOString(),
                    proposals: [],
                    unitSystem: userProfile.unitSystem,
                    notes: `Project started from template: ${template.templateName}`,
                    rooms: [
                        JSON.parse(JSON.stringify(template.roomData)) // Deep copy
                    ],
                    productDatabase: [],
                    ancillaryCosts: { cables: 0, connectors: 0, containment: 0, fixings: 0, materials: 0 }
                };
                dispatchProjectAction({ type: 'LOAD_PROJECT', payload: newProject });
                navigate(`/design/${newProject.projectId}`);
            } catch (e: any) {
                console.error("Failed to create project from template", e);
                setError(`Failed to create project from template: ${e.message}`);
                setAppState('error');
            } finally {
                 setLoadingContext(null);
                 if (setAppState) setAppState('idle');
            }
        }, 500);
    }, [setAppState, setError, setLoadingContext, userProfile, dispatchProjectAction]);

    // FIX: Removed userProfile from signature.
    const handleAcceptRequest = useCallback((request: IncomingRequest, navigate: NavigateFunction) => {
        if (!userProfile) return;
        handleAgentSubmit(`Client: ${request.clientName}\nRequirements: ${request.description}`, navigate);
    }, [handleAgentSubmit, userProfile]);


    return {
        handleGenerateProposal,
        handleAgentSubmit,
        userTemplates,
        handleSaveTemplate,
        handleDeleteTemplate,
        handleStartFromTemplate,
        handleCreateProjectFromTemplate,
        handleAcceptRequest,
    };
};

export default useProjectGeneration;