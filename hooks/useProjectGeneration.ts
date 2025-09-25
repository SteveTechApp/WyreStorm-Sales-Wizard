// FIX: Import React to provide types like Dispatch and SetStateAction
import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NavigateFunction } from 'react-router-dom';
// FIX: Add file extension to satisfy module resolution for types.ts
import { ProjectData, UserProfile, UserTemplate, IncomingRequest, RoomData, Proposal } from '../utils/types.ts';
import { useUserTemplates } from './useUserTemplates.ts';
import { generateProposal } from '../services/proposalService.ts';
import { analyzeRequirements } from '../services/projectAnalysisService.ts';
import { createNewRoom } from '../utils/utils.ts';
import { PRODUCT_DATABASE } from '../data/productDatabase.ts';

const useProjectGeneration = (
    userProfile: UserProfile | null,
    setAppState: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setLoadingContext: React.Dispatch<React.SetStateAction<'template' | 'proposal' | null>>,
    dispatchProjectAction: React.Dispatch<any>
) => {
    const { userTemplates, handleSaveTemplate, handleDeleteTemplate } = useUserTemplates();

    const handleGenerateProposal = useCallback(async (projectData: ProjectData, navigate: NavigateFunction) => {
        if (!userProfile) {
            alert("User profile is not available.");
            return;
        };
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

            const updatedProject = { ...projectData, proposals: [...(projectData.proposals || []), newProposal] };
            dispatchProjectAction({ type: 'UPDATE_PROJECT', payload: updatedProject });
            navigate(`/proposal/${projectData.projectId}/${newProposal.proposalId}`);
        } catch (e: any) {
            console.error(e);
            setError(`Failed to generate proposal: ${e.message}`);
            setAppState('error');
        } finally {
            setLoadingContext(null);
            setAppState('idle');
        }
    }, [userProfile, setAppState, setError, setLoadingContext, dispatchProjectAction]);

    const handleAgentSubmit = useCallback(async (documentText: string, navigate: NavigateFunction) => {
        if (!userProfile) {
             alert("User profile is not available.");
            return;
        }
        setLoadingContext('template');
        setAppState('generating');
        setError(null);
        try {
            const setupData = await analyzeRequirements(documentText, userProfile);
            
            const roomsWithDefaults: RoomData[] = setupData.rooms.map((room: any) => ({
                ...createNewRoom(room.roomName),
                ...room,
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
                productDatabase: PRODUCT_DATABASE,
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
            setAppState('idle');
        }
    }, [userProfile, setAppState, setError, setLoadingContext, dispatchProjectAction]);
    
    const handleStartFromTemplate = useCallback((templateName: string, navigate: NavigateFunction) => {
        // This function seems to be a stub, redirecting to the setup page.
        // It could be enhanced to pre-fill setup with template info.
        navigate('/setup');
    }, []);

    const handleCreateProjectFromTemplate = useCallback((template: UserTemplate, navigate: NavigateFunction, projectDetails?: { projectName: string, clientName: string }) => {
        if (!userProfile) {
            alert("User profile is not available.");
            return;
        }
        setLoadingContext('template');
        setAppState('generating'); 
        
        setTimeout(() => {
            try {
                const baseProjectName = template.templateName.replace(/\s\((Bronze|Silver|Gold)\)$/, '');
                // Deep copy room data to prevent mutation of the template
                const newRoomData = JSON.parse(JSON.stringify(template.roomData));
                newRoomData.id = uuidv4(); // Assign a new ID to the room

                const newProject: ProjectData = {
                    projectId: uuidv4(),
                    projectName: projectDetails?.projectName || `${baseProjectName} Project`,
                    clientName: projectDetails?.clientName || 'New Client',
                    lastSaved: new Date().toISOString(),
                    proposals: [],
                    unitSystem: userProfile.unitSystem,
                    notes: `Project started from template: ${template.templateName}`,
                    rooms: [newRoomData],
                    productDatabase: PRODUCT_DATABASE,
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
                 setAppState('idle');
            }
        }, 500);
    }, [userProfile, setAppState, setError, setLoadingContext, dispatchProjectAction]);

    const handleAcceptRequest = useCallback((request: IncomingRequest, navigate: NavigateFunction) => {
        if (!userProfile) {
            alert("User profile is not available.");
            return;
        }
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