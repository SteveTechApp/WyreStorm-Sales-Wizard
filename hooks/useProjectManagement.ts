import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useHistoryState } from './useHistoryState';
import { ProjectData, ProjectSetupData, Product, Action, UserProfile, AncillaryCosts } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { NavigateFunction } from 'react-router-dom';
import { PRODUCT_DATABASE } from '../data/productDatabase';

const projectReducer = (state: ProjectData | null, action: Action): ProjectData | null => {
    if (state === null && action.type !== 'LOAD_PROJECT') return null;

    switch (action.type) {
        case 'LOAD_PROJECT': return action.payload;
        case 'UPDATE_PROJECT': return { ...action.payload, lastSaved: new Date().toISOString() };
        case 'UPDATE_PROJECT_DETAILS': return { ...state!, projectName: action.payload.projectName, clientName: action.payload.clientName, lastSaved: new Date().toISOString() };
        case 'ADD_ROOM': return { ...state!, rooms: [...state!.rooms, action.payload], lastSaved: new Date().toISOString() };
        case 'UPDATE_ROOM': return { ...state!, rooms: state!.rooms.map(r => r.id === action.payload.id ? action.payload : r), lastSaved: new Date().toISOString() };
        case 'REMOVE_ROOM': return { ...state!, rooms: state!.rooms.filter(r => r.id !== action.payload), lastSaved: new Date().toISOString() };
        case 'ADD_EQUIPMENT': {
            return {
                ...state!,
                rooms: state!.rooms.map(room => {
                    if (room.id === action.payload.roomId) {
                        const existingItem = room.manuallyAddedEquipment.find(item => item.sku === action.payload.equipment.sku);
                        if (existingItem) {
                            return { ...room, manuallyAddedEquipment: room.manuallyAddedEquipment.map(item => item.sku === action.payload.equipment.sku ? { ...item, quantity: item.quantity + 1 } : item) };
                        } else {
                            return { ...room, manuallyAddedEquipment: [...room.manuallyAddedEquipment, action.payload.equipment] };
                        }
                    }
                    return room;
                }),
                lastSaved: new Date().toISOString()
            };
        }
        case 'REMOVE_EQUIPMENT': {
             return { ...state!, rooms: state!.rooms.map(room => room.id === action.payload.roomId ? { ...room, manuallyAddedEquipment: room.manuallyAddedEquipment.filter(item => item.sku !== action.payload.sku) } : room), lastSaved: new Date().toISOString() };
        }
        case 'UPDATE_EQUIPMENT': {
            return {
                ...state!,
                rooms: state!.rooms.map(room => 
                    room.id === action.payload.roomId 
                        ? { 
                            ...room, 
                            manuallyAddedEquipment: room.manuallyAddedEquipment.map(item => 
                                item.sku === action.payload.equipment.sku 
                                    ? action.payload.equipment 
                                    : item
                            ) 
                          } 
                        : room
                ),
                lastSaved: new Date().toISOString()
            };
        }
        case 'UPDATE_NOTES': return { ...state!, notes: action.payload, lastSaved: new Date().toISOString() };
        case 'UPDATE_ANCILLARY_COSTS': return { ...state!, ancillaryCosts: action.payload, lastSaved: new Date().toISOString() };
        case 'SET_RETEST_FLAG': return { ...state!, isRetest: action.payload };
        default: return state;
    }
};

export const useProjectManagement = (userProfile: UserProfile | null) => {
    const [savedProjects, setSavedProjects] = useLocalStorage<ProjectData[]>('savedProjects', []);
    
    const { 
        state: projectData, 
        setState: setProjectData, 
        undo: undoProjectState, 
        redo: redoProjectState,
        canUndo: canUndoProject,
        canRedo: canRedoProject
    } = useHistoryState<ProjectData | null>(null);

    const dispatchProjectAction = useCallback((action: Action) => {
        const newState = projectReducer(projectData, action);
        setProjectData(newState);
    }, [projectData, setProjectData]);
    
    const productDatabase: Product[] = PRODUCT_DATABASE;

    const [appState, setAppState] = useState('idle');
    const [error, setError] = useState<string | null>(null);
    const [loadingContext, setLoadingContext] = useState<'template' | 'proposal' | null>(null);
    
    const [comparisonList, setComparisonList] = useLocalStorage<Product[]>('comparisonList', []);

    // --- START: Auto-saving logic ---
    // Ref to hold the latest projectData for the interval-based save
    const projectDataRef = React.useRef(projectData);
    useEffect(() => {
        projectDataRef.current = projectData;
    }, [projectData]);

    // Centralized function to save a project to local storage.
    const saveProjectToStorage = useCallback((projectToSave: ProjectData | null) => {
        if (!projectToSave) return;

        setSavedProjects(prev => {
            const updatedProjects = [...prev];
            const existingIndex = updatedProjects.findIndex(p => p.projectId === projectToSave.projectId);

            if (existingIndex > -1) {
                // Prevent unnecessary writes if data hasn't changed.
                if (JSON.stringify(updatedProjects[existingIndex]) === JSON.stringify(projectToSave)) {
                    return prev;
                }
                updatedProjects[existingIndex] = projectToSave;
            } else {
                updatedProjects.push(projectToSave);
            }
            return updatedProjects;
        });
    }, [setSavedProjects]);

    // Debounced save triggered by any change in project data for responsiveness.
    useEffect(() => {
        if (projectData) {
            const debouncedSave = setTimeout(() => {
                saveProjectToStorage(projectData);
            }, 500); // Short delay after user stops making changes.
            return () => clearTimeout(debouncedSave);
        }
    }, [projectData, saveProjectToStorage]);

    // Interval-based save every 30 seconds as a backup.
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (projectDataRef.current) {
                saveProjectToStorage(projectDataRef.current);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(intervalId);
    }, [saveProjectToStorage]); // Runs once on mount and cleanup on unmount.
    // --- END: Auto-saving logic ---

    const handleLoadProject = useCallback((projectId: string) => {
        const projectToLoad = savedProjects.find(p => p.projectId === projectId);
        if (projectToLoad) {
            // Load project into history state. We wrap it in a function to avoid setState treating our object as a function.
            setProjectData(() => projectToLoad);
        } else { 
            setError("Project not found."); 
            setAppState('error'); 
        }
    }, [savedProjects, setProjectData]);

    const handleDeleteProject = useCallback((projectId: string) => {
        if (window.confirm('Are you sure you want to permanently delete this project?')) {
            setSavedProjects(prev => prev.filter(p => p.projectId !== projectId));
            if (projectData?.projectId === projectId) dispatchProjectAction({ type: 'LOAD_PROJECT', payload: null as any });
        }
    }, [projectData, setSavedProjects, dispatchProjectAction]);

    const handleNewProjectClick = (navigate: NavigateFunction) => {
        if (!userProfile?.name) { 
             alert("Please complete your profile first."); 
            return; 
        }
        navigate('/setup');
    };

    const handleProjectSetupSubmit = (setupData: ProjectSetupData, navigate: NavigateFunction) => {
        if (!userProfile) return;
        const newProject: ProjectData = { 
            ...setupData, 
            projectId: uuidv4(), 
            lastSaved: new Date().toISOString(), 
            proposals: [], 
            unitSystem: userProfile.unitSystem, 
            notes: '', 
            rooms: [], 
            productDatabase: productDatabase,
            ancillaryCosts: { cables: 0, connectors: 0, containment: 0, fixings: 0, materials: 0 }
        };
        dispatchProjectAction({ type: 'LOAD_PROJECT', payload: newProject });
        navigate(`/design/${newProject.projectId}`);
    };
    
    const toggleComparison = (product: Product) => setComparisonList(prev => prev.some(p => p.sku === product.sku) ? prev.filter(p => p.sku !== product.sku) : [...prev, product]);
    const clearComparison = () => setComparisonList([]);

    return {
        projectData, dispatchProjectAction, savedProjects, handleLoadProject, handleDeleteProject, handleNewProjectClick,
        handleProjectSetupSubmit, productDatabase, appState, setAppState, error, setError,
        loadingContext, setLoadingContext, comparisonList, toggleComparison, clearComparison,
        undoProjectState, redoProjectState, canUndoProject, canRedoProject
    };
};