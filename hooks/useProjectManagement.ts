import { useReducer, useState, useEffect, useCallback, useRef } from 'react';
import { ProjectData, Product } from '../utils/types';
import { useLocalStorage } from './useLocalStorage';
import { projectReducer, ProjectAction } from './reducers/projectReducer.ts';
import toast from 'react-hot-toast';

export type AppState = 'idle' | 'loading' | 'generating' | 'error';
export type LoadingContext = 'template' | 'proposal' | 'design' | 'diagram' | 'default';

export type ProjectManagementType = ReturnType<typeof useProjectManagement>;

export const useProjectManagement = () => {
    const [projectData, dispatchProjectAction] = useReducer(projectReducer, null);
    const [savedProjects, setSavedProjects] = useLocalStorage<ProjectData[]>('savedProjects', []);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    
    const [appState, setAppState] = useState<AppState>('idle');
    const [loadingContext, setLoadingContext] = useState<LoadingContext>('default');
    const [error, setError] = useState<string | null>(null);

    const [comparisonList, setComparisonList] = useState<Product[]>([]);
    
    const projectDataRef = useRef(projectData);
    useEffect(() => {
        projectDataRef.current = projectData;
    }, [projectData]);

    // Auto-select first room when project loads or rooms change
    useEffect(() => {
        if (projectData && projectData.rooms.length > 0) {
            if (!activeRoomId || !projectData.rooms.find(r => r.id === activeRoomId)) {
                setActiveRoomId(projectData.rooms[0].id);
            }
        } else {
            setActiveRoomId(null);
        }
    }, [projectData, activeRoomId]);

    // Auto-save project whenever it changes
    useEffect(() => {
        if (projectData) {
            const existingIndex = savedProjects.findIndex(p => p.projectId === projectData.projectId);
            const updatedProjects = [...savedProjects];
            if (existingIndex !== -1) {
                updatedProjects[existingIndex] = projectData;
            } else {
                updatedProjects.push(projectData);
            }
            // This is a simplified approach; for performance, you might debounce this.
            setSavedProjects(updatedProjects);
        }
    }, [projectData, setSavedProjects]);

    const handleLoadProject = useCallback((projectId: string) => {
        setAppState('loading');
        const projectToLoad = savedProjects.find(p => p.projectId === projectId);
        if (projectToLoad) {
            dispatchProjectAction({ type: 'SET_PROJECT', payload: projectToLoad });
            setAppState('idle');
            toast.success(`Project "${projectToLoad.projectName}" loaded.`);
        } else {
            setError(`Project with ID ${projectId} not found.`);
            setAppState('error');
            toast.error("Failed to load project.");
        }
    }, [savedProjects]);

    const handleDeleteProject = useCallback((projectId: string) => {
        setSavedProjects(prev => prev.filter(p => p.projectId !== projectId));
        if (projectData?.projectId === projectId) {
            dispatchProjectAction({type: 'SET_PROJECT', payload: null!});
        }
        toast.success("Project deleted.");
    }, [projectData, setSavedProjects]);
    
    const getState = useCallback(() => {
        return { projectData: projectDataRef.current };
    }, []);

    const toggleComparison = (product: Product) => {
        setComparisonList(prev => {
            const isComparing = prev.some(p => p.sku === product.sku);
            if (isComparing) {
                return prev.filter(p => p.sku !== product.sku);
            } else {
                if (prev.length < 4) {
                    return [...prev, product];
                }
                toast.error("You can only compare up to 4 products.");
                return prev;
            }
        });
    };

    const clearComparison = () => {
        setComparisonList([]);
    };

    return {
        projectData,
        dispatchProjectAction,
        savedProjects,
        handleLoadProject,
        handleDeleteProject,
        activeRoomId,
        setActiveRoomId,
        appState,
        setAppState,
        loadingContext,
        setLoadingContext,
        error,
        getState,
        comparisonList,
        toggleComparison,
        clearComparison,
    };
};
