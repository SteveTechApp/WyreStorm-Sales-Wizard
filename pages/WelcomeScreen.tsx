import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import { SparklesIcon, PlusCircleIcon } from '../components/Icons.tsx';
import RecentProjects from '../components/RecentProjects.tsx';
import TemplateBrowser from '../components/TemplateBrowser.tsx';
import Logo from '../components/Logo.tsx';
import LaunchPanel from '../components/cockpit/ActionSlider.tsx';
import RadarScreen from '../components/cockpit/RadarScreen.tsx';
import MFD from '../components/cockpit/MFD.tsx';

const WelcomeScreen: React.FC = () => {
    const { userProfile, theme } = useAppContext();
    const navigate = useNavigate();

    const handleActionLaunch = (mode: 'blank' | 'ai') => {
        if (mode === 'blank') {
            navigate('/setup');
        } else {
            navigate('/agent');
        }
    };

    if (theme === 'cockpit') {
        return (
            <div className="animate-fade-in flex-grow flex flex-col p-2 font-mono gap-2">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-grow min-h-0">
                    <div className="lg:col-span-1 flex flex-col gap-2">
                       <TemplateBrowser />
                       <LaunchPanel onLaunch={handleActionLaunch} />
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-2">
                        <RadarScreen />
                        <MFD />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in flex-grow flex flex-col p-2 sm:p-4">
            <header className="text-center py-8">
                <div className="inline-block">
                    <Logo />
                </div>
                <h1 className="text-4xl font-bold font-display text-text-primary mt-4">Welcome, {userProfile?.name}</h1>
                <p className="text-text-secondary mt-2 max-w-2xl mx-auto">
                    This is your command center for designing world-class AV systems. Start by analyzing a client brief with AI, create a blank project, or launch from a pre-built template.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <button
                    onClick={() => navigate('/agent')}
                    className="group bg-background-secondary p-6 rounded-lg border border-border-color hover:border-primary/50 hover:bg-background transition-all"
                >
                    <div className="flex items-center gap-4">
                        <SparklesIcon className="h-8 w-8 text-accent flex-shrink-0" />
                        <div>
                            <h2 className="text-lg font-bold text-text-primary text-left">Analyze a Brief with AI</h2>
                            <p className="text-sm text-text-secondary text-left">Paste a client email or requirements doc to have the AI agent build the initial project structure for you.</p>
                        </div>
                    </div>
                </button>
                 <button
                    onClick={() => navigate('/setup')}
                    className="group bg-background-secondary p-6 rounded-lg border border-border-color hover:border-primary/50 hover:bg-background transition-all"
                >
                    <div className="flex items-center gap-4">
                        <PlusCircleIcon className="h-8 w-8 text-primary flex-shrink-0" />
                         <div>
                            <h2 className="text-lg font-bold text-text-primary text-left">Start a Blank Project</h2>
                            <p className="text-sm text-text-secondary text-left">Manually create a new project from scratch, adding and configuring rooms as you go.</p>
                        </div>
                    </div>
                </button>
            </div>

            <TemplateBrowser />
            <RecentProjects />
        </div>
    );
};

export default WelcomeScreen;