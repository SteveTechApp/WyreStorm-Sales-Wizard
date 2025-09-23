import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AgentInputForm from './AgentInputForm';
import ProjectSetupScreen from './ProjectSetupScreen';
import { ProjectData } from '../utils/types';
import TemplateBrowser from '../components/TemplateBrowser';
import RecentProjects from '../components/RecentProjects';

type WelcomeMode = 'options' | 'agent' | 'manual';

const WelcomeScreen: React.FC = () => {
    const { savedProjects, handleLoadProject, handleDeleteProject } = useAppContext();
    const navigate = useNavigate();
    const [mode, setMode] = useState<WelcomeMode>('options');

    const handleSelectProject = (projectId: string) => {
        handleLoadProject(projectId);
        navigate(`/design/${projectId}`);
    };

    if (mode === 'agent') {
        return <div className="flex-grow flex items-center justify-center p-4"><AgentInputForm /></div>;
    }
    if (mode === 'manual') {
        return <div className="flex-grow flex items-center justify-center p-4"><ProjectSetupScreen /></div>;
    }

    return (
        <div className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="w-full max-w-7xl mx-auto animate-fade-in flex-grow flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-background-secondary p-4 rounded-lg border border-border-color">
                        <h1 className="text-xl font-bold text-text-primary mb-3">Start a New Project</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <button onClick={() => setMode('agent')} className="p-4 bg-card hover:bg-card-hover border border-border-color rounded-lg transition-all text-left">
                                <span className="text-xl">📋</span>
                                <h2 className="text-sm font-semibold mt-2">Analyze Brief</h2>
                                <p className="text-xs text-text-secondary mt-1">AI analyzes a client brief to auto-setup a project.</p>
                            </button>
                            <button onClick={() => setMode('manual')} className="p-4 bg-card hover:bg-card-hover border border-border-color rounded-lg transition-all text-left">
                                <span className="text-xl">✍️</span>
                                <h2 className="text-sm font-semibold mt-2">Start from Scratch</h2>
                                <p className="text-xs text-text-secondary mt-1">Create a blank project and build manually.</p>
                            </button>
                        </div>
                    </div>
                     <RecentProjects
                        savedProjects={savedProjects}
                        onSelectProject={handleSelectProject}
                        onDeleteProject={handleDeleteProject}
                     />
                </div>

                <div className="flex-grow flex flex-col min-h-0 bg-background-secondary p-4 rounded-lg border border-border-color">
                    <TemplateBrowser />
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
