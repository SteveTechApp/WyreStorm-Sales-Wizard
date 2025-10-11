import React from 'react';
import RecentProjects from '../RecentProjects.tsx';
import { GridIcon, EducationIcon, PlusIcon, SparklesIcon } from '../Icons.tsx';
import Logo from '../Logo.tsx';
import ActionButton from './ActionButton.tsx';

const DefaultWelcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center flex-grow animate-fade-in-fast h-full">
            
            {/* Hero Section */}
            <div className="relative pt-2 pb-4 text-center z-10">
                <div className="mb-4 flex justify-center">
                    <Logo />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-text-primary">
                    AI Co-Pilot for AV Systems
                </h1>
                <p className="mt-1 max-w-2xl mx-auto text-lg text-text-secondary">
                    From client brief to full proposal in minutes. Design flawless WyreStorm solutions with your AI Wingman.
                </p>
            </div>

            {/* Main Content */}
            <div className="relative w-full max-w-7xl mx-auto py-4 z-10 grid grid-cols-1 lg:grid-cols-5 gap-4 items-start flex-grow">
                
                {/* Left Column (2/5) */}
                <div className="lg:col-span-2 h-full">
                    <RecentProjects />
                </div>

                {/* Right Column (3/5) */}
                <div className="lg:col-span-3 h-full flex flex-col">
                     <h2 className="text-2xl font-bold text-center text-text-primary mb-2">Start a Mission</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                        <ActionButton 
                            to="/setup"
                            icon={<PlusIcon />}
                            title="Plan New Project"
                            description="Define project parameters and configure rooms from scratch."
                        />
                        <ActionButton 
                            to="/agent"
                            icon={<SparklesIcon />}
                            title="Analyze Client Intel"
                            description="Let the AI parse a brief, email, or RFQ to build a project."
                        />
                        <ActionButton 
                            to="/templates"
                            icon={<GridIcon />}
                            title="Start From Template"
                            description="Use a pre-configured room design for any vertical market."
                        />
                        <ActionButton 
                            to="/training"
                            icon={<EducationIcon />}
                            title="Go to Training Academy"
                            description="Complete modules on AV fundamentals and WyreStorm tech."
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DefaultWelcome;
