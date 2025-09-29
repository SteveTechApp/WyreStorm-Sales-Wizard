import React from 'react';
import WelcomeHeader from './WelcomeHeader.tsx';
import ActionButtons from './ActionButtons.tsx';
import RecentProjects from '../RecentProjects.tsx';
import TemplateBrowser from '../TemplateBrowser.tsx';

const DefaultWelcome: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in-fast">
            <WelcomeHeader />
            <ActionButtons />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentProjects />
                <TemplateBrowser />
            </div>
        </div>
    );
};

export default DefaultWelcome;
