
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import WelcomeScreen from './components/WelcomeScreen';
import ProjectSetupScreen from './components/ProjectSetupScreen';
import DesignCoPilot from './components/DesignCoPilot';
import ProposalDisplay from './components/ProposalDisplay';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import ProfileModal from './components/ProfileModal';
import AgentInputForm from './components/AgentInputForm';
import QuickQuestionFAB from './components/QuickQuestionFAB';
import QuickQuestionModal from './components/QuickQuestionModal';
import { ProjectData, ProjectSetupData, Proposal, UserProfile, RoomData } from './types';
import { generateProposal, analyzeRequirements } from './services/geminiService';

type AppState = 'welcome' | 'agent-input' | 'project-setup' | 'design-copilot' | 'generating-proposal' | 'proposal-display' | 'error';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('welcome');
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isQuickQuestionModalOpen, setIsQuickQuestionModalOpen] = useState(false);

    // Load data from localStorage on initial render
    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                setUserProfile(JSON.parse(savedProfile));
            }

            const projects = localStorage.getItem('savedProjects');
            if (projects) {
                setSavedProjects(JSON.parse(projects));
            }
        } catch (e) {
            console.error("Failed to load data from localStorage", e);
        }
    }, []);

    const handleSaveUserProfile = (profile: UserProfile) => {
        setUserProfile(profile);
        localStorage.setItem('userProfile', JSON.stringify(profile));
    };

    const handleSaveProject = useCallback((data: ProjectData) => {
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

    const handleNewProject = () => {
        setProjectData(null);
        setProposal(null);
        setAppState('welcome');
    };

    const handleStartSetup = () => setAppState('project-setup');
    const handleStartAgent = () => setAppState('agent-input');

    const handleProjectSetupSubmit = (setupData: ProjectSetupData) => {
        const newProject: ProjectData = {
            ...setupData,
            projectId: uuidv4(),
            lastSaved: new Date().toISOString(),
            rooms: setupData.rooms.map(r => ({ ...r, id: uuidv4() })),
        };
        setProjectData(newProject);
        setAppState('design-copilot');
    };
    
    const handleAgentSubmit = async (text: string) => {
        setAppState('generating-proposal'); // Show loading state
        try {
            const requirements = await analyzeRequirements(text, userProfile);
            const newProject: ProjectData = {
                ...requirements,
                projectId: uuidv4(),
                lastSaved: new Date().toISOString(),
                rooms: requirements.rooms.map(r => ({ ...r, id: uuidv4() })),
            };
            setProjectData(newProject);
            setAppState('design-copilot');
        } catch(e: any) {
            setError(`Failed to analyze document: ${e.message}`);
            setAppState('error');
        }
    };

    const handleGenerateProposal = async (data: ProjectData) => {
        setAppState('generating-proposal');
        setProjectData(data); // Save latest state before generating
        handleSaveProject(data);
        try {
            const generatedProposal = await generateProposal(data, userProfile);
            setProposal(generatedProposal);
            setAppState('proposal-display');
        } catch (e: any) {
            setError(`The AI failed to generate the proposal. Error: ${e.message}`);
            setAppState('error');
        }
    };

    const handleDeleteProject = (projectId: string) => {
        const newProjects = savedProjects.filter(p => p.projectId !== projectId);
        setSavedProjects(newProjects);
        localStorage.setItem('savedProjects', JSON.stringify(newProjects));
    };

    const handleLoadProject = (projectId: string) => {
        const projectToLoad = savedProjects.find(p => p.projectId === projectId);
        if (projectToLoad) {
            setProjectData(projectToLoad);
            setAppState('design-copilot');
        }
    };
    
     const handleStartFromTemplate = (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', templateName: string, participantCount: number) => {
        const newProject: ProjectData = {
            projectId: uuidv4(),
            projectName: `${templateName} Project`,
            clientName: userProfile?.company || 'My Company',
            lastSaved: new Date().toISOString(),
            rooms: [{
                id: uuidv4(),
                roomName: templateName,
                roomType,
                designTier,
                maxParticipants: participantCount,
                // These are defaults, user will reconfigure in the next step
                features: [],
                functionalityStatement: '',
            }]
        };
        setProjectData(newProject);
        setAppState('design-copilot');
    };

    const renderContent = () => {
        switch (appState) {
            case 'welcome':
                return <WelcomeScreen 
                            onStart={handleStartSetup} 
                            onStartAgent={handleStartAgent}
                            savedProjects={savedProjects}
                            onLoadProject={handleLoadProject}
                            onDeleteProject={handleDeleteProject}
                            onStartFromTemplate={handleStartFromTemplate}
                        />;
            case 'agent-input':
                return <AgentInputForm onSubmit={handleAgentSubmit} onBack={handleNewProject} />;
            case 'project-setup':
                return <ProjectSetupScreen 
                            onSubmit={handleProjectSetupSubmit} 
                            onBack={handleNewProject}
                            defaultProjectName={`New Project ${new Date().toLocaleDateString()}`}
                            userProfile={userProfile}
                        />;
            case 'design-copilot':
                if (!projectData || !userProfile) return <LoadingSpinner message="Loading Project..." />;
                return <DesignCoPilot 
                            initialData={projectData} 
                            onSubmit={handleGenerateProposal} 
                            onSaveProject={handleSaveProject} 
                            userProfile={userProfile}
                        />;
            case 'generating-proposal':
                return <LoadingSpinner message="Generating Your Proposal..." />;
            case 'proposal-display':
                if (!proposal || !projectData) return <LoadingSpinner message="Loading Proposal..." />;
                return <ProposalDisplay 
                            proposal={proposal} 
                            projectData={projectData}
                            userProfile={userProfile}
                            unitSystem={userProfile?.unitSystem || 'imperial'}
                        />;
            case 'error':
                return <ErrorDisplay error={error} onAcknowledge={handleNewProject} acknowledgeButtonText="Start Over" />;
            default:
                return <div>Invalid state</div>;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            <Header onNewProject={handleNewProject} onShowProfile={() => setIsProfileModalOpen(true)} userProfile={userProfile} />
            <main className="flex-grow p-4 sm:p-8 overflow-y-auto flex items-center justify-center">
                {renderContent()}
            </main>
            <ProfileModal 
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={handleSaveUserProfile}
                initialProfile={userProfile}
            />
            <QuickQuestionFAB onClick={() => setIsQuickQuestionModalOpen(true)} />
            <QuickQuestionModal isOpen={isQuickQuestionModalOpen} onClose={() => setIsQuickQuestionModalOpen(false)} />
        </div>
    );
};

export default App;
