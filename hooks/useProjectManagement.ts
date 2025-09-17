import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, ProjectSetupData, UserProfile } from '../utils/types';
import { createDefaultRoomData } from '../utils/utils';

export const useProjectManagement = (isInitialLoadComplete: boolean, userProfile: UserProfile | null) => {
    const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
    const [projectData, setProjectData] = useState<ProjectData | null>(null);

    useEffect(() => {
        if (isInitialLoadComplete) {
            try {
                const projects = localStorage.getItem('savedProjects');
                if (projects) setSavedProjects(JSON.parse(projects));
            } catch (e) {
                console.error("Failed to load saved projects from localStorage", e);
            }
        }
    }, [isInitialLoadComplete]);

    const handleSaveProject = useCallback((data: ProjectData) => {
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
    }, []);

    const handleNewProject = useCallback(() => {
        setProjectData(null);
    }, []);

    const handleProjectSetupSubmit = useCallback((setupData: ProjectSetupData, navigate: (path: string) => void) => {
        const newProject: ProjectData = {
            ...setupData,
            clientContactName: '',
            clientContactEmail: '',
            clientAddress: '',
            projectId: uuidv4(),
            lastSaved: new Date().toISOString(),
            rooms: setupData.rooms.map(r => ({ ...createDefaultRoomData(), ...r, id: uuidv4() })),
            proposals: [],
            notes: '',
        };
        handleSaveProject(newProject);
        setProjectData(newProject);
        navigate(`/design/${newProject.projectId}`);
    }, [handleSaveProject]);
    
    const handleDeleteProject = useCallback((projectId: string) => {
        const newProjects = savedProjects.filter(p => p.projectId !== projectId);
        setSavedProjects(newProjects);
        localStorage.setItem('savedProjects', JSON.stringify(newProjects));
    }, [savedProjects]);

    const handleLoadProject = useCallback((projectId: string, navigate: (path: string) => void) => {
        const projectToLoad = savedProjects.find(p => p.projectId === projectId);
        if (projectToLoad) {
            setProjectData(projectToLoad);
            navigate(`/design/${projectToLoad.projectId}`);
        }
    }, [savedProjects]);

    return {
        projectData,
        setProjectData,
        savedProjects,
        handleSaveProject,
        handleNewProject,
        handleProjectSetupSubmit,
        handleDeleteProject,
        handleLoadProject,
    };
};