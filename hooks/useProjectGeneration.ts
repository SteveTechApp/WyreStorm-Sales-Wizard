// FIX: Corrected typo 'react-outer-dom' to 'react-router-dom' to import the useNavigate hook type correctly.
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext.tsx';
import { useUserContext } from '../context/UserContext.tsx';
import { ProjectData, ProjectSetupData, RoomData, UserTemplate, ManuallyAddedEquipment, DesignTier, ValueEngineeringSuggestion } from '../utils/types.ts';
import { analyzeRequirements } from '../services/projectAnalysisService.ts';
import { designRoom, generateDiagram } from '../services/roomDesignerService.ts';
import { generateProposal } from '../services/proposalService.ts';
import { createNewRoom } from '../utils/utils.ts';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { PRODUCT_DATABASE } from '../data/productDatabase.ts';

export const useProjectGeneration = () => {
    const { dispatchProjectAction, setAppState, setLoadingContext, getState } = useProjectContext();
    const { userProfile } = useUserContext();

    const getActiveProductDatabase = () => {
        return userProfile.customProductDatabase && userProfile.customProductDatabase.length > 0
            ? userProfile.customProductDatabase
            : PRODUCT_DATABASE;
    };

    const withLoading = async (context: 'template' | 'proposal' | 'design' | 'diagram' | 'default', action: () => Promise<void>) => {
        setAppState('generating');
        setLoadingContext(context);
        try {
            await action();
        } catch (error) {
            console.error(`Error during generation context '${context}':`, error);
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
            setAppState('error');
        } finally {
            setAppState('idle');
            setLoadingContext('default');
        }
    };

    const handleAgentSubmit = async (documentText: string, navigate: ReturnType<typeof useNavigate>) => {
        await withLoading('template', async () => {
            const requirements = await analyzeRequirements(documentText, userProfile);
            const newProject: ProjectData = {
                projectId: uuidv4(),
                projectName: requirements.projectName,
                clientName: requirements.clientName,
                lastSaved: new Date().toISOString(),
                rooms: requirements.rooms.map((roomStub, index) => ({
                    ...createNewRoom(),
                    id: uuidv4(),
                    roomName: `Room ${index + 1}`,
                    roomType: 'Other',
                    designTier: 'Silver',
                    ...roomStub
                })),
                proposals: [],
                unitSystem: 'metric',
                notes: `Generated from client brief:\n\n${documentText}`,
                infrastructure: { useDedicatedNetwork: false, enableTouchAppPreview: false, cablingByOthers: false },
                productDatabase: getActiveProductDatabase(),
            };
            dispatchProjectAction({ type: 'SET_PROJECT', payload: newProject });
            toast.success('Project created from client brief!');
            navigate(`/design/${newProject.projectId}`);
        });
    };

    const handleProjectSetupSubmit = async (setupData: ProjectSetupData, navigate: ReturnType<typeof useNavigate>) => {
       await withLoading('template', async () => {
            const newProject: ProjectData = {
                projectId: uuidv4(),
                projectName: setupData.projectName,
                clientName: setupData.clientName,
                lastSaved: new Date().toISOString(),
                rooms: setupData.rooms,
                proposals: [],
                unitSystem: 'metric',
                notes: '',
                infrastructure: { useDedicatedNetwork: false, enableTouchAppPreview: false, cablingByOthers: false },
                productDatabase: getActiveProductDatabase(),
            };
            dispatchProjectAction({ type: 'SET_PROJECT', payload: newProject });
            toast.success('Project created!');
            navigate(`/design/${newProject.projectId}`);
       });
    };
    
    const handleStartFromTemplate = (template: UserTemplate, tier: DesignTier, navigate: ReturnType<typeof useNavigate>) => {
         withLoading('template', async () => {
            const newProject: ProjectData = {
                projectId: uuidv4(),
                projectName: `${template.templateName} Project`,
                clientName: 'New Client',
                lastSaved: new Date().toISOString(),
                rooms: [{...template.roomData, id: uuidv4(), designTier: tier}],
                proposals: [],
                unitSystem: 'metric',
                notes: `Started from template: ${template.templateName}`,
                infrastructure: { useDedicatedNetwork: false, enableTouchAppPreview: false, cablingByOthers: false },
                productDatabase: getActiveProductDatabase(),
            };
            dispatchProjectAction({ type: 'SET_PROJECT', payload: newProject });
            toast.success(`Project started from "${template.templateName}" as a ${tier} design!`);
            navigate(`/design/${newProject.projectId}`);
        });
    }

    const handleDesignRoom = async (roomId: string) => {
        const project = getState().projectData;
        if (!project) return;
        const roomToDesign = project.rooms.find(r => r.id === roomId);
        if (!roomToDesign) return;

        await withLoading('design', async () => {
            const result = await designRoom(roomToDesign, project.productDatabase);
            const fullEquipment: ManuallyAddedEquipment[] = result.manuallyAddedEquipment.map(item => {
                const product = project.productDatabase.find(p => p.sku === item.sku);
                return {
                    ...product!,
                    quantity: item.quantity,
                }
            });

            const updatedRoom: RoomData = {
                ...roomToDesign,
                functionalityStatement: result.functionalityStatement,
                manuallyAddedEquipment: fullEquipment,
                systemDiagram: undefined
            };

            dispatchProjectAction({ type: 'UPDATE_ROOM', payload: updatedRoom });
            toast.success(`AI has designed room: ${roomToDesign.roomName}`);
        });
    };

    const handleValueEngineerRoom = async (roomId: string, constraints: string[], suggestions: ValueEngineeringSuggestion[]) => {
        const project = getState().projectData;
        if (!project) return;
        const roomToEngineer = project.rooms.find(r => r.id === roomId);
        if (!roomToEngineer) return;

        const roomWithChanges = { 
            ...roomToEngineer, 
            valueEngineeringConstraints: constraints,
            valueEngineeringSuggestions: suggestions,
        };
        dispatchProjectAction({ type: 'UPDATE_ROOM', payload: roomWithChanges });

        await withLoading('design', async () => {
            const result = await designRoom(roomWithChanges, project.productDatabase);
            const fullEquipment: ManuallyAddedEquipment[] = result.manuallyAddedEquipment.map(item => {
                const product = project.productDatabase.find(p => p.sku === item.sku);
                return { ...product!, quantity: item.quantity };
            });

            const updatedRoom: RoomData = {
                ...roomWithChanges,
                functionalityStatement: result.functionalityStatement,
                manuallyAddedEquipment: fullEquipment,
                systemDiagram: undefined
            };
            dispatchProjectAction({ type: 'UPDATE_ROOM', payload: updatedRoom });
            toast.success(`Room re-designed with new constraints!`);
        });
    };
    
    const handleGenerateDiagram = async (roomId: string) => {
        const project = getState().projectData;
        if (!project) return;
        const roomToUpdate = project.rooms.find(r => r.id === roomId);
        if (!roomToUpdate || roomToUpdate.manuallyAddedEquipment.length === 0) {
            toast.error("Please design the room and add equipment before generating a diagram.");
            return;
        }

        await withLoading('diagram', async () => {
            const diagram = await generateDiagram(roomToUpdate);
            const updatedRoom: RoomData = { ...roomToUpdate, systemDiagram: diagram };
            dispatchProjectAction({ type: 'UPDATE_ROOM', payload: updatedRoom });
            toast.success(`System diagram generated for ${roomToUpdate.roomName}`);
        });
    };

    const handleGenerateProposal = async (projectData: ProjectData, navigate: ReturnType<typeof useNavigate>) => {
        if (projectData.rooms.length === 0 || projectData.rooms.every(r => r.manuallyAddedEquipment.length === 0)) {
            toast.error("Please add at least one room with equipment before generating a proposal.");
            return;
        }
        await withLoading('proposal', async () => {
            const generatedData = await generateProposal(projectData, userProfile);
            const newProposal = {
                ...generatedData,
                proposalId: uuidv4(),
                version: (projectData.proposals?.length || 0) + 1,
                createdAt: new Date().toISOString(),
            };
            dispatchProjectAction({ type: 'ADD_PROPOSAL', payload: newProposal });
            toast.success('Proposal generated!');
            navigate(`/proposal/${projectData.projectId}/${newProposal.proposalId}`);
        });
    };

    return {
        handleAgentSubmit,
        handleProjectSetupSubmit,
        handleStartFromTemplate,
        handleDesignRoom,
        handleGenerateDiagram,
        handleGenerateProposal,
        handleValueEngineerRoom,
    };
};