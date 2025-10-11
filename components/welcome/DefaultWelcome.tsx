import React from 'react';
import { Link } from 'react-router-dom';
import RecentProjects from '../RecentProjects.tsx';
import { GridIcon, EducationIcon, PlusIcon, SparklesIcon } from '../Icons.tsx';
import Logo from '../Logo.tsx';

const ActionButton: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
    <Link 
        to={to} 
        className="flex items-start text-left gap-6 p-6 bg-glass-bg rounded-xl border border-border-color/50 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-accent/50"
    >
        <div className="flex-shrink-0 text-accent mt-1">
            {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8" })}
        </div>
        <div>
            <h3 className="font-bold text-lg text-text-primary">{title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
    </Link>
);


const DefaultWelcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center flex-grow animate-fade-in-fast">
            
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 z-0"></div>

            {/* Hero Section */}
            <div className="relative py-12 text-center z-10">
                <div className="mb-8 flex justify-center">
                    <Logo />
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-text-primary">
                    AI Co-Pilot for AV Systems
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
                    From client brief to full proposal in minutes. Design flawless WyreStorm solutions with your AI Wingman.
                </p>
            </div>

            {/* Main Content */}
            <div className="relative w-full max-w-7xl mx-auto py-12 z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column */}
                <div className="lg:col-span-2">
                    <RecentProjects />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                     <h2 className="text-3xl font-bold text-center text-text-primary">Start a Mission</h2>
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
    );
};

export default DefaultWelcome;