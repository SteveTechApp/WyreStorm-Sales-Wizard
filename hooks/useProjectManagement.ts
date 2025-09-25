import { useReducer, useEffect, useCallback, useState } from 'react';
import { useLocalStorage } from './useLocalStorage.ts';
import { useHistoryState } from './useHistoryState.ts';
import { v4 as uuidv4 } from 'uuid';
import { NavigateFunction } from 'react-router-dom';
// FIX: Import ProjectInfrastructure type.
import { ProjectData, UserProfile, Product, ProjectSetupData, ManuallyAddedEquipment, AncillaryCosts, ProjectInfrastructure } from '../utils/types.ts';
import { PRODUCT_DATABASE } from '../data/productDatabase.ts';
import { createNewRoom } from '../utils/utils.ts';

type ProjectAction =
    | { type: 'LOAD_PROJECT'; payload: ProjectData }
    | { type: 'UPDATE_PROJECT'; payload: ProjectData }
    | { type: 'ADD_ROOM'; payload: Omit<ProjectData['rooms'][0], 'id'> }
    | { type: 'REMOVE_ROOM'; payload: string }
    | { type: 'UPDATE_ROOM'; payload: ProjectData['rooms'][0] }
    | { type: 'ADD_EQUIPMENT'; payload: { roomId: string; equipment: ManuallyAddedEquipment } }
    | { type: 'REMOVE_EQUIPMENT'; payload: { roomId: string; sku: string } }
    | { type: 'UPDATE_EQUIPMENT'; payload: { roomId: string; equipment: ManuallyAddedEquipment } }
    | { type: 'UPDATE_NOTES'; payload: string }
    | { type: 'UPDATE_PROJECT_DETAILS'; payload: { projectName: string; clientName: string } }
    | { type: 'UPDATE_ANCILLARY_COSTS'; payload: AncillaryCosts }
    // FIX: Add UPDATE_INFRASTRUCTURE action type.
    | { type: 'UPDATE_INFRASTRUCTURE'; payload: ProjectInfrastructure };


const projectReducer = (state: ProjectData | null, action: ProjectAction): ProjectData | null => {
    if (!state && action.type !== 'LOAD_PROJECT') return null;

    switch (action.type) {
        case 'LOAD_PROJECT':
        case 'UPDATE_PROJECT':
            return { ...action.payload, lastSaved: new Date().toISOString() };
        
        case 'UPDATE_PROJECT_DETAILS':
             if (!state) return null;
            return { ...state, ...action.payload };

        case 'ADD_ROOM':
             if (!state) return null;
            const newRoom = { ...action.payload, id: uuidv4() };
            return { ...state, rooms: [...state.rooms, newRoom] };

        case 'REMOVE_ROOM':
             if (!state) return null;
            return { ...state, rooms: state.rooms.filter(room => room.id !== action.payload) };

        case 'UPDATE_ROOM':
             if (!state) return null;
            return {
                ...state,
                rooms: state.rooms.map(room => (room.id === action.payload.id ? action.payload : room)),
            };
        
        case 'ADD_EQUIPMENT': {
             if (!state) return null;
            return {
                ...state,
                rooms: state.rooms.map(room => {
                    if (room.id === action.payload.roomId) {
                        const existingItem = room.manuallyAddedEquipment.find(item => item.sku === action.payload.equipment.sku);
                        if (existingItem) {
                            // If item exists, just increase quantity
                            return { ...room, manuallyAddedEquipment: room.manuallyAddedEquipment.map(item => item.sku === action.payload.equipment.sku ? { ...item, quantity: item.quantity + 1 } : item) };
                        }
                        // Otherwise, add new item
                        return { ...room, manuallyAddedEquipment: [...room.manuallyAddedEquipment, action.payload.equipment] };
                    }
                    return room;
                }),
            };
        }

        case 'REMOVE_EQUIPMENT': {
             if (!state) return null;
            return {
                ...state,
                rooms: state.rooms.map(room => {
                    if (room.id === action.payload.roomId) {
                        return { ...room, manuallyAddedEquipment: room.manuallyAddedEquipment.filter(item => item.sku !== action.payload.sku) };
                    }
                    return room;
                }),
            };
        }

        case 'UPDATE_EQUIPMENT': {
             if (!state) return null;
            return {
                ...state,
                rooms: state.rooms.map(room => {
                    if (room.id === action.payload.roomId) {
                        return { ...room, manuallyAddedEquipment: room.manuallyAddedEquipment.map(item => item.sku === action.payload.equipment.sku ? action.payload.equipment : item) };
                    }
                    return room;
                }),
            };
        }
        
        case 'UPDATE_NOTES':
             if (!state) return null;
            return { ...state, notes: action.payload };

        case 'UPDATE_ANCILLARY_COSTS':
             if (!state) return null;
            return { ...state, ancillaryCosts: action.payload };

        // FIX: Add case to handle infrastructure updates.
        case 'UPDATE_INFRASTRUCTURE':
             if (!state) return null;
            return { ...state, infrastructure: action.payload };

        default:
            return state;
    }
};

export const useProjectManagement = (userProfile: UserProfile | null) => {
    const [savedProjects, setSavedProjects] = useLocalStorage<ProjectData[]>('savedProjects', []);
    
    const { 
        state: projectData, 
        setState: setProjectDataWithHistory, 
        undo: undoProjectState, 
        redo: redoProjectState, 
        canUndo: canUndoProject, 
        canRedo: canRedoProject 
    } = useHistoryState<ProjectData | null>(null);
    
    const [appState, setAppState] = useState('idle'); // idle, loading, generating, error
    const [error, setError] = useState<string | null>(null);
    const [loadingContext, setLoadingContext] = useState<'template' | 'proposal' | null>(null);
    const [comparisonList, setComparisonList] = useState<Product[]>([]);
    
    const setAndSaveProjectData = useCallback((project: ProjectData | null) => {
        setProjectDataWithHistory(project);
        if (project) {
            setSavedProjects(prev => {
                const existingIndex = prev.findIndex(p => p.projectId === project.projectId);
                const newSavedProjects = [...prev];
                if (existingIndex > -1) {
                    newSavedProjects[existingIndex] = project;
                } else {
                    newSavedProjects.push(project);
                }
                return newSavedProjects;
            });
        }
    }, [setProjectDataWithHistory, setSavedProjects]);
    
    const dispatchProjectAction = useCallback((action: ProjectAction) => {
        const newState = projectReducer(projectData, action);
        if (newState !== projectData) {
            setAndSaveProjectData(newState);
        }
    }, [projectData, setAndSaveProjectData]);
    
    const handleLoadProject = useCallback((projectId: string) => {
        const projectToLoad = savedProjects.find(p => p.projectId === projectId);
        if (projectToLoad) {
            setProjectDataWithHistory(projectToLoad);
        } else {
            console.error(`Project with ID ${projectId} not found.`);
            setError(`Project with ID ${projectId} not found.`);
            setAppState('error');
        }
    }, [savedProjects, setProjectDataWithHistory, setError, setAppState]);

    const handleDeleteProject = useCallback((projectId: string) => {
        if (window.confirm('Are you sure you want to permanently delete this project?')) {
            setSavedProjects(prev => prev.filter(p => p.projectId !== projectId));
            if (projectData?.projectId === projectId) {
                setProjectDataWithHistory(null);
            }
        }
    }, [projectData, setSavedProjects, setProjectDataWithHistory]);

    const handleNewProjectClick = (navigate: NavigateFunction) => {
        setProjectDataWithHistory(null);
        navigate('/setup');
    };

    const handleProjectSetupSubmit = (setupData: ProjectSetupData, navigate: NavigateFunction) => {
        if (!userProfile) return;
        const newProject: ProjectData = {
            projectId: uuidv4(),
            projectName: setupData.projectName,
            clientName: setupData.clientName,
            lastSaved: new Date().toISOString(),
            rooms: setupData.rooms.map(r => ({...createNewRoom(r.roomName), ...r})),
            proposals: [],
            unitSystem: userProfile.unitSystem,
            notes: `Project created on ${new Date().toLocaleDateString()}.`,
            ancillaryCosts: { cables: 0, connectors: 0, containment: 0, fixings: 0, materials: 0 },
            productDatabase: PRODUCT_DATABASE
        };
        setAndSaveProjectData(newProject);
        navigate(`/design/${newProject.projectId}`);
    };
    
    // Comparison Tray Logic
    const toggleComparison = (product: Product) => {
        setComparisonList(prev => 
            prev.some(p => p.sku === product.sku)
                ? prev.filter(p => p.sku !== product.sku)
                : [...prev, product]
        );
    };

    const clearComparison = () => setComparisonList([]);
    
    return {
        projectData,
        dispatchProjectAction,
        savedProjects,
        handleLoadProject,
        handleDeleteProject,
        handleNewProjectClick,
        handleProjectSetupSubmit,
        productDatabase: PRODUCT_DATABASE,
        appState,
        setAppState,
        error,
        setError,
        loadingContext,
        setLoadingContext,
        comparisonList,
        toggleComparison,
        clearComparison,
        undoProjectState,
        redoProjectState,
        canUndoProject,
        canRedoProject,
    };
};