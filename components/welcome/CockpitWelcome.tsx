import React, { useState } from 'react';
import InfoModal from '../InfoModal.tsx';
import RecentProjects from '../RecentProjects.tsx';
import HomeMenuButton from './HomeMenuButton.tsx';
import { ClockIcon, GridIcon, SparklesIcon, PlusIcon } from '../Icons.tsx';

const CockpitWelcome: React.FC = () => {
    const [isRecentProjectsOpen, setIsRecentProjectsOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center text-center flex-grow animate-fade-in-fast p-4">
            <h1 className="text-4xl font-extrabold tracking-widest uppercase text-accent font-mono">
                WINGMAN OS
            </h1>
            <p className="text-lg text-text-secondary mt-2 font-mono">// AI CO-PILOT ENGAGED</p>

            <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <HomeMenuButton
                    onClick={() => setIsRecentProjectsOpen(true)}
                    icon={<ClockIcon className="h-8 w-8 text-accent" />}
                    title="Load Sortie"
                    description="Load a previous sortie and continue your mission."
                />
                <HomeMenuButton
                    to="/setup"
                    icon={<PlusIcon className="h-8 w-8 text-accent" />}
                    title="New Sortie"
                    description="Plan a new sortie from scratch with manual parameters."
                />
                <HomeMenuButton
                    to="/agent"
                    icon={<SparklesIcon className="h-8 w-8 text-accent" />}
                    title="Intel Analysis"
                    description="Parse enemy intel to build a sortie plan automatically."
                />
                <HomeMenuButton
                    to="/templates"
                    icon={<GridIcon className="h-8 w-8 text-accent" />}
                    title="Load Doctrine"
                    description="Launch a sortie from a pre-built combat doctrine."
                />
            </div>
            <InfoModal isOpen={isRecentProjectsOpen} onClose={() => setIsRecentProjectsOpen(false)} title="Recent Sorties">
                <RecentProjects />
            </InfoModal>
        </div>
    );
};

export default CockpitWelcome;
