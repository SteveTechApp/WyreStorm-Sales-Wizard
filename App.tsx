
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import WelcomeScreen from './components/WelcomeScreen';
import ProjectBuilder from './components/ProjectBuilder';
import ProposalDisplay from './components/ProposalDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import AgentInputForm from './components/AgentInputForm';
// FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
import { ProjectData, Proposal, RoomData, IO_Device, UserProfile } from './types';
import { generateProposal, parseUserNotes, generateRoomTemplate } from './services/geminiService';
import ProfileModal from './components/ProfileModal';

type AppState = 'welcome' | 'agent' | 'builder' | 'loading' | 'proposal';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [generatedProposal, setGeneratedProposal] = useState<Proposal | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Generating Proposal...');
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load saved projects and profile from localStorage on initial render
  useEffect(() => {
    try {
      const projectsJson = localStorage.getItem('av_ai_projects');
      if (projectsJson) {
        setSavedProjects(JSON.parse(projectsJson));
      }
      const profileJson = localStorage.getItem('av_ai_user_profile');
      if (profileJson) {
        setUserProfile(JSON.parse(profileJson));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const createNewProject = async (firstRoomType: string) => {
    setLoadingMessage('Creating Project Template...');
    setAppState('loading');
    try {
      const roomTemplate = await generateRoomTemplate(firstRoomType);
      // FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
      const newRoom: RoomData = {
        ...roomTemplate,
        id: uuidv4(),
        // FIX: The `id` property is now added to each I/O device, which is expected by the `IO_Device` type.
        // The properties on `roomTemplate` are now correctly accessed.
        videoInputs: roomTemplate.videoInputs.map(d => ({ ...d, id: uuidv4() })),
        videoOutputs: roomTemplate.videoOutputs.map(d => ({ ...d, id: uuidv4() })),
        audioInputs: roomTemplate.audioInputs.map(d => ({ ...d, id: uuidv4() })),
        audioOutputs: roomTemplate.audioOutputs.map(d => ({ ...d, id: uuidv4() })),
      };
      const newProject: ProjectData = {
        projectId: uuidv4(),
        projectName: 'New AV Project',
        lastSaved: new Date().toISOString(),
        rooms: [newRoom],
      };
      setCurrentProject(newProject);
      setAppState('builder');
    } catch (error) {
      console.error("Failed to create new project with template", error);
      // Fallback to a blank project
      const blankProject: ProjectData = {
        projectId: uuidv4(),
        projectName: 'New AV Project',
        lastSaved: new Date().toISOString(),
        rooms: [],
      };
      setCurrentProject(blankProject);
      setAppState('builder');
    }
  };
  
  const handleStartFromQuestionnaire = () => {
    // For simplicity, we start with a default room type. A setup screen could be added here.
    createNewProject('Medium Conference Room');
  }

  const handleStartFromAgent = () => {
    setAppState('agent');
  }

  const handleParseNotes = async (notes: string) => {
    setLoadingMessage('Analyzing Customer Notes...');
    setAppState('loading');
    try {
        const roomTemplates = await parseUserNotes(notes);
        // FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
        const newRooms: RoomData[] = roomTemplates.map(template => ({
            ...template,
            id: uuidv4(),
            // FIX: The `id` property is now added to each I/O device, which is expected by the `IO_Device` type.
            // The properties on `template` are now correctly accessed.
            videoInputs: (template.videoInputs || []).map((d: Omit<IO_Device, 'id'>) => ({...d, id: uuidv4()})),
            videoOutputs: (template.videoOutputs || []).map((d: Omit<IO_Device, 'id'>) => ({...d, id: uuidv4()})),
            audioInputs: (template.audioInputs || []).map((d: Omit<IO_Device, 'id'>) => ({...d, id: uuidv4()})),
            audioOutputs: (template.audioOutputs || []).map((d: Omit<IO_Device, 'id'>) => ({...d, id: uuidv4()})),
        }));

        const newProject: ProjectData = {
            projectId: uuidv4(),
            projectName: 'New Project from Notes',
            lastSaved: new Date().toISOString(),
            rooms: newRooms.length > 0 ? newRooms : [],
        };
        setCurrentProject(newProject);
        setAppState('builder');
    } catch (error) {
        console.error("Failed to parse notes", error);
        alert("Could not analyze the notes. Please try again or start with a template.");
        setAppState('welcome');
    }
  };

  const handleGenerateProposal = async (projectData: ProjectData) => {
    if (!userProfile?.company) {
        alert("Please complete your company profile before generating a proposal.");
        setIsProfileModalOpen(true);
        return;
    }
    setCurrentProject(projectData);
    setLoadingMessage('Generating AI Proposal...');
    setAppState('loading');
    try {
      const proposal = await generateProposal(projectData, userProfile);
      setGeneratedProposal(proposal);
      setAppState('proposal');
    } catch (error) {
      console.error("Failed to generate proposal", error);
      alert("An error occurred while generating the proposal. Please check the console and try again.");
      setAppState('builder');
    }
  };

  const handleSaveProject = (projectData: ProjectData) => {
    const updatedProject = { ...projectData, lastSaved: new Date().toISOString() };
    setCurrentProject(updatedProject);
    const existingIndex = savedProjects.findIndex(p => p.projectId === updatedProject.projectId);
    let newSavedProjects;
    if (existingIndex > -1) {
      newSavedProjects = [...savedProjects];
      newSavedProjects[existingIndex] = updatedProject;
    } else {
      newSavedProjects = [...savedProjects, updatedProject];
    }
    setSavedProjects(newSavedProjects);
    localStorage.setItem('av_ai_projects', JSON.stringify(newSavedProjects));
    alert('Project Saved!');
  };

  const handleLoadProject = (projectId: string) => {
    const projectToLoad = savedProjects.find(p => p.projectId === projectId);
    if (projectToLoad) {
      setCurrentProject(projectToLoad);
      setAppState('builder');
    }
  };
  
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
        const newSavedProjects = savedProjects.filter(p => p.projectId !== projectId);
        setSavedProjects(newSavedProjects);
        localStorage.setItem('av_ai_projects', JSON.stringify(newSavedProjects));
    }
  };
  
  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('av_ai_user_profile', JSON.stringify(profile));
  };

  const handleBackToBuilder = () => {
    setGeneratedProposal(null);
    setAppState('builder');
  };
  
  const handleNewProject = () => {
    setCurrentProject(null);
    setGeneratedProposal(null);
    setAppState('welcome');
  }

  const renderContent = () => {
    switch (appState) {
      case 'welcome':
        return <WelcomeScreen 
                    onStart={handleStartFromQuestionnaire} 
                    onStartAgent={handleStartFromAgent}
                    savedProjects={savedProjects}
                    onLoadProject={handleLoadProject}
                    onDeleteProject={handleDeleteProject}
                />;
      case 'agent':
        return <AgentInputForm onSubmit={handleParseNotes} onBack={() => setAppState('welcome')} />;
      case 'builder':
        if (currentProject) {
          return <ProjectBuilder 
                    initialData={currentProject} 
                    onSubmit={handleGenerateProposal} 
                    onSaveProject={handleSaveProject}
                 />;
        }
        // This case handles initialization, e.g. after a project is loaded but before builder renders
        return <LoadingSpinner message="Loading Project..." />;
      case 'loading':
        return <LoadingSpinner message={loadingMessage} />;
      case 'proposal':
        if (generatedProposal && currentProject) {
          return <ProposalDisplay 
                    proposal={generatedProposal} 
                    projectName={currentProject.projectName} 
                    onBack={handleBackToBuilder} 
                 />;
        }
        // Fallback if state is inconsistent
        handleNewProject();
        return <LoadingSpinner />;
      default:
        return <WelcomeScreen 
                  onStart={handleStartFromQuestionnaire} 
                  onStartAgent={handleStartFromAgent}
                  savedProjects={savedProjects}
                  onLoadProject={handleLoadProject}
                  onDeleteProject={handleDeleteProject}
              />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header onNewProject={handleNewProject} onShowProfile={() => setIsProfileModalOpen(true)} userProfile={userProfile} />
      <main className="p-4 md:p-8 flex items-start justify-center">
        {renderContent()}
      </main>
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        initialProfile={userProfile}
      />
    </div>
  );
};

export default App;
