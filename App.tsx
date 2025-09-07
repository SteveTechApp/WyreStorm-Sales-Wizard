
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, Proposal, UserProfile, RoomData, IO_Device } from './types';
import { generateProposal, parseCustomerNotes } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import DesignCoPilot from './components/DesignCoPilot';
import ProposalDisplay from './components/ProposalDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import AgentInputForm from './components/AgentInputForm';

type View = 'welcome' | 'agent-input' | 'co-pilot' | 'generating' | 'proposal' | 'error';
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
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile({ currency: 'GBP', unitSystem: 'imperial', ...profile });
      } else {
        setUserProfile({ name: '', company: 'Your Company', email: '', logoUrl: '', currency: 'GBP', unitSystem: 'imperial' });
      }

      const savedProjectsData = localStorage.getItem('savedProjects');
      if (savedProjectsData) {
        setSavedProjects(JSON.parse(savedProjectsData));
      }
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
      setView('co-pilot');
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

  const handleStartDesign = () => {
    const newProject: ProjectData = {
        projectId: uuidv4(),
        projectName: `New Project ${new Date().toLocaleDateString()}`,
        clientName: '',
        clientContactName: '',
        clientContactEmail: '',
        clientAddress: '',
        coverImage: '',
        rooms: [],
        lastSaved: new Date().toISOString(),
    };
    setProjectData(newProject);
    setView('co-pilot');
  };

  const handleStartAgent = () => setView('agent-input');
  const handleBackToWelcome = () => setView('welcome');
  
  const handleAgentSubmit = async (text: string) => {
    setView('generating');
    setLoadingMessage('Analyzing Notes...');
    setError(null);
    try {
        const parsedData = await parseCustomerNotes(text);
        
        const newProject: ProjectData = {
            projectId: uuidv4(),
            projectName: parsedData.projectName || `Project from Notes ${new Date().toLocaleDateString()}`,
            clientName: parsedData.clientName || '',
            clientContactName: parsedData.clientContactName || '',
            clientContactEmail: parsedData.clientContactEmail || '',
            clientAddress: parsedData.clientAddress || '',
            coverImage: '',
            rooms: (parsedData.rooms || []).map((room: Partial<RoomData>) => ({
                ...room,
                id: uuidv4()
            } as RoomData)),
            lastSaved: new Date().toISOString(),
        };
        setProjectData(newProject);
        setView('co-pilot');
    } catch (e: any) {
        console.error("Failed to parse notes:", e);
        setError("The AI failed to understand the provided notes. Please try rephrasing or use the main design tool.");
        setView('error');
    }
  };

  const handleGenerateProposal = async (data: ProjectData) => {
    saveProject(data);
    setLoadingMessage("Generating Proposal...");
    setView('generating');
    setError(null);
    try {
      const generatedProposal = await generateProposal(data, userProfile, userProfile?.unitSystem || 'imperial');
      setProposal(generatedProposal);
      setView('proposal');
    } catch (e: any) {
      console.error("Failed to generate proposal:", e);
      setError("The AI failed to generate a proposal. Please ensure all rooms have a name and at least one defined feature, then try again.");
      setView('error');
    }
  };
  
  const renderContent = () => {
    switch (view) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartDesign} onStartAgent={handleStartAgent} savedProjects={savedProjects} onLoadProject={loadProject} onDeleteProject={deleteProject} />;
      case 'agent-input':
        return <AgentInputForm onSubmit={handleAgentSubmit} onBack={handleBackToWelcome} />;
      case 'co-pilot':
        if (projectData && userProfile) return <DesignCoPilot initialData={projectData} onSubmit={handleGenerateProposal} onSaveProject={saveProject} userProfile={userProfile} />;
        return null;
      case 'generating':
        return <LoadingSpinner message={loadingMessage} />;
      case 'proposal':
        if (proposal && projectData && userProfile) return <ProposalDisplay proposal={proposal} projectData={projectData} userProfile={userProfile} unitSystem={userProfile.unitSystem} />;
        return null;
      case 'error':
        return (
          <div className="text-center p-8 bg-white rounded-lg border border-red-200 shadow-lg w-full max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-red-600 mb-3">An Error Occurred</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => projectData ? setView('co-pilot') : setView('welcome')} 
              className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-6 rounded-lg"
            >
              {projectData ? 'Back to Project' : 'Back to Home'}
            </button>
          </div>
        );
      default:
        return <WelcomeScreen onStart={handleStartDesign} onStartAgent={handleStartAgent} savedProjects={savedProjects} onLoadProject={loadProject} onDeleteProject={deleteProject} />;
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
