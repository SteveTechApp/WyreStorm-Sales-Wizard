import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, Proposal, UserProfile, RoomData, createDefaultRoomData, Currency } from './types';
import { generateProposal, parseCustomerNotes, generateRoomTemplate } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import ProjectSetupScreen from './components/ProjectSetupScreen';
import ProjectBuilder from './components/ProjectBuilder';
import ProposalDisplay from './components/ProposalDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import AgentInputForm from './components/AgentInputForm';

type View = 'welcome' | 'setup' | 'agent-input' | 'builder' | 'generating' | 'proposal' | 'error';
export type UnitSystem = 'imperial' | 'metric';

const App: React.FC = () => {
  const [view, setView] = useState<View>('welcome');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Generating Proposal...');


  useEffect(() => {
    // Load saved data from localStorage on initial render
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        // Ensure currency has a default value if loading an old profile
        const profile = JSON.parse(savedProfile);
        if (!profile.currency) {
          profile.currency = 'GBP';
        }
        setUserProfile(profile);
      } else {
        // Set a default profile if none exists
        setUserProfile({ name: '', company: 'Your Company', email: '', logoUrl: '', currency: 'GBP' });
      }

      const savedProjectsData = localStorage.getItem('savedProjects');
      if (savedProjectsData) setSavedProjects(JSON.parse(savedProjectsData));
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
  }, []);

  const saveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const saveProject = useCallback((data: ProjectData) => {
    const updatedData = { ...data, lastSaved: new Date().toISOString() };
    setSavedProjects(prev => {
      const existingIndex = prev.findIndex(p => p.projectId === updatedData.projectId);
      const newProjects = [...prev];
      if (existingIndex > -1) {
        newProjects[existingIndex] = updatedData;
      } else {
        newProjects.push(updatedData);
      }
      localStorage.setItem('savedProjects', JSON.stringify(newProjects));
      return newProjects;
    });
    setProjectData(updatedData);
  }, []);

  const loadProject = (projectId: string) => {
    const projectToLoad = savedProjects.find(p => p.projectId === projectId);
    if (projectToLoad) {
      setProjectData(projectToLoad);
      setView('builder');
    }
  };

  const deleteProject = (projectId: string) => {
    const newProjects = savedProjects.filter(p => p.projectId !== projectId);
    setSavedProjects(newProjects);
    localStorage.setItem('savedProjects', JSON.stringify(newProjects));
  };

  const handleNewProject = () => {
    setProjectData(null);
    setProposal(null);
    setView('welcome');
  };

  const handleStartSetup = () => setView('setup');
  const handleStartAgent = () => setView('agent-input');
  const handleBackToWelcome = () => setView('welcome');
  
  const handleProjectSetupSubmit = async ({ projectName, clientName, coverImage, rooms }: { projectName: string; clientName: string; coverImage: string; rooms: Record<string, number> }) => {
      setLoadingMessage('Creating Project Templates...');
      setView('generating');
      setError(null);
      try {
          const roomPromises = Object.entries(rooms).flatMap(([roomType, quantity]) =>
              Array.from({ length: quantity }, () => generateRoomTemplate(roomType, 'Standard'))
          );

          const results = await Promise.allSettled(roomPromises);

          const successfulRooms: RoomData[] = [];
          results.forEach((result, i) => {
              if (result.status === 'fulfilled') {
                  const newRoom: RoomData = { ...result.value, id: uuidv4() };
                   // Add unique suffix if room name already exists
                  let counter = 1;
                  let potentialName = newRoom.roomName;
                  while (successfulRooms.some(r => r.roomName === potentialName)) {
                      counter++;
                      potentialName = `${newRoom.roomName} ${counter}`;
                  }
                  newRoom.roomName = potentialName;
                  successfulRooms.push(newRoom);
              } else {
                  console.error(`Failed to generate template for room ${i}:`, result.reason);
              }
          });
          
           if (successfulRooms.length === 0) {
              throw new Error("The AI failed to generate any room templates. Please try again.");
           }

          const newProject: ProjectData = {
              projectId: uuidv4(),
              projectName,
              clientName,
              coverImage,
              rooms: successfulRooms,
              lastSaved: new Date().toISOString(),
          };
          setProjectData(newProject);
          setView('builder');
      } catch (e: any) {
          console.error("Failed to setup project:", e);
          setError(e.message || "An unexpected error occurred during project setup.");
          setView('error');
      }
  };
  
  const handleAgentSubmit = async (text: string) => {
    setView('generating');
    setError(null);
    try {
        const parsedData = await parseCustomerNotes(text);
        
        const sanitizedRooms = (parsedData.rooms || []).map(partialRoom => {
            const fullRoom = {
                ...createDefaultRoomData(partialRoom.roomType || 'Conference Room', partialRoom.roomName || 'Unnamed Room'),
                ...partialRoom,
            };
            fullRoom.videoInputs = (fullRoom.videoInputs || []).map(io => ({ ...createDefaultRoomData('','').videoInputs[0], ...io, id: uuidv4() }));
            fullRoom.videoOutputs = (fullRoom.videoOutputs || []).map(io => ({ ...createDefaultRoomData('','').videoOutputs[0], ...io, id: uuidv4() }));
            
            return fullRoom;
        });

        const finalRooms = sanitizedRooms.length > 0 ? sanitizedRooms : [createDefaultRoomData('Conference Room', 'Conference Room 1')];

        const newProject: ProjectData = {
            projectId: uuidv4(),
            projectName: parsedData.projectName || `Project from Notes ${new Date().toLocaleDateString()}`,
            clientName: parsedData.clientName || '',
            coverImage: '',
            rooms: finalRooms,
            lastSaved: new Date().toISOString(),
        };
        setProjectData(newProject);
        setView('builder');
    } catch (e: any) {
        console.error("Failed to parse notes:", e);
        setError("The AI failed to understand the provided notes. Please try rephrasing or use the questionnaire.");
        setView('error');
    }
  };

  const handleGenerateProposal = async (data: ProjectData) => {
    saveProject(data);
    setLoadingMessage("Generating Proposal...");
    setView('generating');
    setError(null);
    try {
      // Pass the entire userProfile object, which includes the currency.
      const generatedProposal = await generateProposal(data, userProfile, unitSystem);
      setProposal(generatedProposal);
      setView('proposal');
    } catch (e: any) {
      console.error("Failed to generate proposal:", e);
      setError("The AI failed to generate a proposal from the provided data. Please review your project configuration and try again.");
      setView('error');
    }
  };
  
  const renderContent = () => {
    switch (view) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartSetup} onStartAgent={handleStartAgent} savedProjects={savedProjects} onLoadProject={loadProject} onDeleteProject={deleteProject} />;
      case 'setup':
        return <ProjectSetupScreen onSubmit={handleProjectSetupSubmit} onBack={handleBackToWelcome} defaultProjectName={`New Project ${new Date().toLocaleDateString()}`} />;
      case 'agent-input':
        return <AgentInputForm onSubmit={handleAgentSubmit} onBack={handleBackToWelcome} />;
      case 'builder':
        if (projectData) return <ProjectBuilder initialData={projectData} onSubmit={handleGenerateProposal} onSaveProject={saveProject} unitSystem={unitSystem} />;
        return null;
      case 'generating':
        return <LoadingSpinner message={loadingMessage} />;
      case 'proposal':
        if (proposal && projectData) return <ProposalDisplay proposal={proposal} projectData={projectData} userProfile={userProfile} unitSystem={unitSystem} />;
        return null;
      case 'error':
        return (
          <div className="text-center p-8 bg-white rounded-lg border border-red-200 shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button onClick={() => setView('builder')} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-6 rounded-lg">
              Back to Project
            </button>
          </div>
        );
      default:
        return <WelcomeScreen onStart={handleStartSetup} onStartAgent={handleStartAgent} savedProjects={savedProjects} onLoadProject={loadProject} onDeleteProject={deleteProject} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      <Header
        onNewProject={handleNewProject}
        onShowProfile={() => setIsProfileModalOpen(true)}
        userProfile={userProfile}
        unitSystem={unitSystem}
        onUnitSystemChange={setUnitSystem}
        onProfileChange={saveUserProfile} // Pass the save function to the header for the applet
      />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        {renderContent()}
      </main>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={saveUserProfile}
        initialProfile={userProfile}
      />
    </div>
  );
};

export default App;