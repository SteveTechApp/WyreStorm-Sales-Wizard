import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, Proposal, UserProfile, Feature } from '../utils/types';
import { generateProposal } from '../services/proposalService';
import { analyzeRequirements } from '../services/projectAnalysisService';
import { generateInspiredRoomDesign } from '../services/roomDesignerService';
import { createDefaultRoomData } from '../utils/utils';

type AppState = 'idle' | 'generating-proposal' | 'error';

export const useProjectGeneration = (userProfile: UserProfile | null, handleSaveProject: (data: ProjectData) => void) => {
    const [appState, setAppState] = useState<AppState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [loadingContext, setLoadingContext] = useState<'template' | 'proposal' | null>(null);

    const handleNewProject = useCallback(() => {
        setAppState('idle');
    }, []);
    
    const handleAgentSubmit = useCallback(async (text: string, navigate: (path: string) => void) => {
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
                proposals: [],
                notes: `Project generated from the following user-provided document:\n\n---\n${text.substring(0, 500)}...\n---`,
            };
            handleSaveProject(newProject);
            setAppState('idle');
            navigate(`/design/${newProject.projectId}`);
        } catch(e: any) {
            setError(`Failed to analyze document: ${e.message}`);
            setAppState('error');
        }
    }, [userProfile, handleSaveProject]);

    const handleGenerateProposal = useCallback(async (data: ProjectData, navigate: (path: string) => void) => {
        setLoadingContext('proposal');
        setAppState('generating-proposal');
        handleSaveProject(data); // Save latest design changes first
        try {
            const generatedProposalData = await generateProposal(data, userProfile);
            
            const newVersion = (data.proposals?.length || 0) + 1;
            const newProposal: Proposal = {
                ...generatedProposalData,
                proposalId: uuidv4(),
                version: newVersion,
                createdAt: new Date().toISOString(),
            };

            const projectWithNewProposal = {
                ...data,
                proposals: [...(data.proposals || []), newProposal],
            };
            handleSaveProject(projectWithNewProposal);

            setAppState('idle');
            navigate(`/proposal/${projectWithNewProposal.projectId}/${newProposal.proposalId}`);
        } catch (e: any) {
            setError(`The AI failed to generate the proposal. Error: ${e.message}`);
            setAppState('error');
        }
    }, [userProfile, handleSaveProject]);
    
    const handleStartFromTemplate = useCallback(async (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', templateName: string, participantCount: number, navigate: (path: string) => void) => {
        setLoadingContext('template');
        setAppState('generating-proposal');
        try {
            const inspiredRoom = await generateInspiredRoomDesign(templateName, roomType, designTier, participantCount, 'metric');
            const newProject: ProjectData = {
                projectId: uuidv4(),
                projectName: `${templateName} Project`,
                clientName: userProfile?.company || 'My Company',
                lastSaved: new Date().toISOString(),
                rooms: [{ ...createDefaultRoomData(), ...inspiredRoom, id: uuidv4() }],
                proposals: [],
                notes: `Project started from template: ${templateName} (${designTier})`,
            };
            handleSaveProject(newProject);
            setAppState('idle');
            navigate(`/design/${newProject.projectId}`);
        } catch (e: any) {
            setError(`Failed to generate from template: ${e.message}`);
            setAppState('error');
        }
    }, [userProfile, handleSaveProject]);

    return {
        appState, setAppState, error, loadingContext,
        handleNewProject, handleAgentSubmit, handleGenerateProposal, handleStartFromTemplate
    };
};