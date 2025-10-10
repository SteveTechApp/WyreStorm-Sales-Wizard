import React from 'react';
import { Link } from 'react-router-dom';
import RecentProjects from '../RecentProjects.tsx';
import { GridIcon, CameraIcon, EducationIcon } from '../Icons.tsx';
import Logo from '../Logo.tsx';

const FeatureCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
    <Link 
        to={to} 
        className="block p-8 bg-glass-bg rounded-xl border border-border-color/50 text-center backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-accent/50"
    >
        <div className="flex justify-center text-accent">
            {React.cloneElement(icon as React.ReactElement, { className: "h-10 w-10" })}
        </div>
        <h3 className="mt-4 font-bold text-xl text-text-primary">{title}</h3>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </Link>
);

const DefaultWelcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center flex-grow animate-fade-in-fast">
            
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 z-0"></div>

            {/* Hero Section */}
            <div className="relative py-12 md:py-20 z-10">
                <div className="mb-8 flex justify-center">
                    <Logo />
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-text-primary">
                    AI Co-Pilot for AV Systems
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
                    From client brief to full proposal in minutes. Design flawless WyreStorm solutions with your AI Wingman.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Link to="/setup" className="btn btn-primary px-8 py-3 text-base">
                        Create New Project
                    </Link>
                    <Link to="/agent" className="btn btn-secondary px-8 py-3 text-base">
                        Analyse Brief
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative w-full max-w-7xl mx-auto py-12 z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        to="/templates"
                        icon={<GridIcon />}
                        title="Template Library"
                        description="Start your design from a pre-configured room template for any vertical market."
                    />
                    <FeatureCard 
                        to="/video-generator"
                        icon={<CameraIcon />}
                        title="AI Video Generator"
                        description="Create short product animations or training videos from a simple text description."
                    />
                    <FeatureCard 
                        to="/training"
                        icon={<EducationIcon />}
                        title="Wingman Academy"
                        description="Complete modules on AV fundamentals and WyreStorm tech to earn your certificate."
                    />
                </div>
            </div>

            {/* Recent Projects Section */}
            <div className="relative w-full max-w-7xl mx-auto py-12 z-10">
                <RecentProjects />
            </div>

        </div>
    );
};

export default DefaultWelcome;