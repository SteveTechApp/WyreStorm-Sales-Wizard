

import React, { useState } from 'react';
import InfoModal from '../InfoModal.tsx';
import RecentProjects from '../RecentProjects.tsx';
import HomeMenuButton from './HomeMenuButton.tsx';
import { ClockIcon, GridIcon, SparklesIcon, PlusIcon } from '../Icons.tsx';
import Logo from '../Logo.tsx';

const DefaultWelcome: React.FC = () => {
    const [isRecentProjectsOpen, setIsRecentProjectsOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center text-center flex-grow">
            <div className="mb-2">
                <Logo />
            </div>

            <h1 className="text-4xl font-extrabold tracking-widest uppercase text-text-primary">
                WyreStorm Wingman
            </h1>
            <p className="text-lg text-text-secondary mt-2">Your AI Co-Pilot for AV System Design</p>

            <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <HomeMenuButton
                    onClick={() => setIsRecentProjectsOpen(true)}
                    icon={<ClockIcon className="h-8 w-8 text-accent" />}
                    title="Recent Projects"
                    description="Load a previous project and continue your work."
                />
                <HomeMenuButton
                    to="/setup"
                    icon={<PlusIcon className="h-8 w-8 text-accent" />}
                    title="Create New Project"
                    description="Start a new sortie from scratch with manual setup."
                />
                <HomeMenuButton
                    to="/agent"
                    icon={<SparklesIcon className="h-8 w-8 text-accent" />}
                    title="Analyse Client Brief"
                    description="Let the AI agent parse intel to build a project automatically."
                    isDamaged
                />
                <HomeMenuButton
                    to="/templates"
                    icon={<GridIcon className="h-8 w-8 text-accent" />}
                    title="Start from Template"
                    description="Launch a new project from a pre-built design template."
                />
            </div>

            <InfoModal isOpen={isRecentProjectsOpen} onClose={() => setIsRecentProjectsOpen(false)} title="Recent Projects">
                <RecentProjects />
            </InfoModal>
        </div>
    );
};

export default DefaultWelcome;
