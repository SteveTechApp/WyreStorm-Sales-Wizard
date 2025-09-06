import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, Proposal, UserProfile, RoomData, createDefaultRoomData, Currency, IO_Device } from './types';
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
        if (!profile.unitSystem) {
          profile.unitSystem = 'imperial';
        }
        setUserProfile(profile);
      } else {
        // Set a default profile if none exists
        setUserProfile({ name: '', company: 'Your Company', email: '', logoUrl: '', currency: 'GBP', unitSystem: 'imperial' });
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
  
  const handleProjectSetupSubmit = async ({ projectName, clientName, coverImage, rooms }: { projectName: string; clientName: string; coverImage: string; rooms: { roomType: string; designTier: string }[] }) => {
      setLoadingMessage('Creating Project Templates...');
      setView('generating');
      setError(null);
      try {
          const aiRoomRequests = rooms.filter(r => r.designTier !== 'Manual');
          const manualRoomRequests = rooms.filter(r => r.designTier === 'Manual');

          const aiRoomPromises = aiRoomRequests.map(room => 
            generateRoomTemplate(room.roomType, room.designTier)
          );

          const results = await Promise.allSettled(aiRoomPromises);
          
          const generatedRooms: RoomData[] = [];

          // Process AI-generated rooms
          results.forEach((result, i) => {
              if (result.status === 'fulfilled') {
                  const newRoom: RoomData = { ...result.value, id: uuidv4() };
                  generatedRooms.push(newRoom);
              } else {
                  console.error(`Failed to generate template for AI room ${aiRoomRequests[i].roomType}:`, result.reason);
              }
          });

          // Process manually-added rooms
          manualRoomRequests.forEach(room => {
              // Use the roomType for the initial roomName
              const newRoom = createDefaultRoomData(room.roomType, room.roomType);
              generatedRooms.push(newRoom);
          });
          
           if (generatedRooms.length === 0) {
              throw new Error("Failed to generate or create any room templates. Please try again.");
           }

          // Handle unique naming for ALL rooms together to prevent conflicts
          const finalRooms: RoomData[] = [];
          generatedRooms.forEach(newRoom => {
              let counter = 1;
              let potentialName = newRoom.roomName;
              while (finalRooms.some(r => r.roomName === potentialName)) {
                  counter++;
                  const baseName = newRoom.roomName.replace(/ \d+$/, '');
                  potentialName = `${baseName} ${counter}`;
              }
              newRoom.roomName = potentialName;
              finalRooms.push(newRoom);
          });

          const newProject: ProjectData = {
              projectId: uuidv4(),
              projectName,
              clientName,
              coverImage,
              rooms: finalRooms,
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
        
        const completeIO = (io: Partial<IO_Device>, ioType: IO_Device['ioType']): IO_Device => ({
          name: 'Unnamed Device',
          type: 'Unknown',
          connectionType: 'HDMI',
          cableType: 'CAT6a Shielded',
          terminationPoint: 'Wall Plate',
          distance: 25,
          notes: 'Auto-generated from notes.',
          ...io, // Overwrite defaults with data from AI
          id: uuidv4(),
          ioType: ioType,
        });

        const sanitizedRooms = (parsedData.rooms || []).map(partialRoom => {
            const fullRoom = {
                ...createDefaultRoomData(partialRoom.roomType || 'Conference Room', partialRoom.roomName || 'Unnamed Room'),
                ...partialRoom,
            };
            
            fullRoom.videoInputs = (partialRoom.videoInputs || []).map(io => completeIO(io, 'videoInput'));
            fullRoom.videoOutputs = (partialRoom.videoOutputs || []).map(io => completeIO(io, 'videoOutput'));
            
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
      const generatedProposal = await generateProposal(data, userProfile, userProfile?.unitSystem || 'imperial');
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
        return <ProjectSetupScreen 
                  onSubmit={handleProjectSetupSubmit} 
                  onBack={handleBackToWelcome} 
                  defaultProjectName={`New Project ${new Date().toLocaleDateString()}`}
                  userProfile={userProfile}
                />;
      case 'agent-input':
        return <AgentInputForm onSubmit={handleAgentSubmit} onBack={handleBackToWelcome} />;
      case 'builder':
        if (projectData && userProfile) return <ProjectBuilder initialData={projectData} onSubmit={handleGenerateProposal} onSaveProject={saveProject} unitSystem={userProfile.unitSystem} />;
        return null;
      case 'generating':
        return <LoadingSpinner message={loadingMessage} />;
      case 'proposal':
        if (proposal && projectData && userProfile) return <ProposalDisplay proposal={proposal} projectData={projectData} userProfile={userProfile} unitSystem={userProfile.unitSystem} />;
        return null;
      case 'error':
        return (
          <div className="text-center p-8 bg-white rounded-lg border border-red-200 shadow-lg w-full max-w-2xl mx-auto animate-fade-in">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-3">An Error Occurred</h2>
            <p className="text-gray-600 mb-6">{error}</p>

            {error && error.toLowerCase().includes('proposal') && (
                <div className="text-left bg-red-50 p-4 rounded-md border border-red-200 mb-6">
                    <h3 className="font-semibold text-red-800 mb-2">What to check:</h3>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        <li><strong>Incomplete Data:</strong> Ensure each room has a name, dimensions, and at least one input or output defined.</li>
                        <li><strong>Network Connection:</strong> Verify that you are connected to the internet.</li>
                        <li><strong>AI Service:</strong> The service may be temporarily unavailable. Please wait a moment before trying again.</li>
                    </ul>
                </div>
            )}

            <button 
              onClick={() => projectData ? setView('builder') : setView('welcome')} 
              className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              {projectData ? 'Back to Project' : 'Back to Home'}
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
