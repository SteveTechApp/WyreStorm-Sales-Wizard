import React from 'react';
import { Link } from 'react-router-dom';
import RecentProjects from '../RecentProjects.tsx';
import { GridIcon, CameraIcon, EducationIcon } from '../Icons.tsx';
import Logo from '../Logo.tsx';

const FeatureCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
    <Link to={to} className="block p-8 bg-background-secondary rounded-lg border border-transparent text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-border-color">
        <div className="flex justify-center" style={{ color: 'var(--destructive)' }}>
            {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8" })}
        </div>
        <h3 className="mt-4 font-bold text-lg text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </Link>
);

const DefaultWelcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center flex-grow animate-fade-in-fast">
            
            {/* Hero Section */}
            <div className="py-12 md:py-20">
                <div className="mb-8">
                    <Logo className="justify-center" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
                    AI-Powered AV System Design
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
                    Your co-pilot for creating flawless WyreStorm solutions. From client brief to full proposal in minutes.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/setup" className="btn btn-primary px-8 py-3 text-base">
                        Create New Project
                    </Link>
                    <Link to="/agent" className="btn btn-secondary px-8 py-3 text-base">
                        Analyse Client Brief
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="w-full max-w-7xl mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        to="/templates"
                        icon={<GridIcon className="h-6 w-6" />}
                        title="Browse Templates"
                        description="Start your design from a pre-configured room template for any vertical market."
                    />
                    <FeatureCard 
                        to="/video-generator"
                        icon={<CameraIcon className="h-6 w-6" />}
                        title="AI Video Generator"
                        description="Create short product animations or training videos from a simple text description."
                    />
                    <FeatureCard 
                        to="/training"
                        icon={<EducationIcon className="h-6 w-6" />}
                        title="WyreStorm Training"
                        description="Complete modules on AV fundamentals and WyreStorm tech to earn your certificate."
                    />
                </div>
            </div>

            {/* Recent Projects Section */}
            <div className="w-full max-w-7xl mx-auto py-12">
                <RecentProjects />
            </div>

        </div>
    );
};

export default DefaultWelcome;
