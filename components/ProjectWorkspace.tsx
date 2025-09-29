import React, { useState } from 'react';
import WorkspaceHeader from './workspace/WorkspaceHeader.tsx';
import WorkspaceTabs from './workspace/WorkspaceTabs.tsx';
import WorkspaceContent from './workspace/WorkspaceContent.tsx';
import SidePanel from './workspace/SidePanel.tsx';

const ProjectWorkspace: React.FC = () => {
    const [activeTab, setActiveTab] = useState('config');

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-fast">
            <div className="flex-grow space-y-6">
                <WorkspaceHeader />
                <WorkspaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-6">
                    <WorkspaceContent activeTab={activeTab} />
                </div>
            </div>
            <SidePanel />
        </div>
    );
};

export default ProjectWorkspace;
