import React, { useState } from 'react';
import ProjectsTab from './mfd/ProjectsTab.tsx';
import StatusTab from './mfd/StatusTab.tsx';
import SectorButton from './SectorButton.tsx';

type MFDTab = 'projects' | 'status';

const MFD: React.FC = () => {
    const [activeTab, setActiveTab] = useState<MFDTab>('projects');
    
    return (
        <div className="flex-grow p-4 bg-black border-4 border-border-color rounded-none mfd-screen font-mono text-accent h-full flex flex-col">
            <div className="flex justify-center gap-2 border-b-2 border-border-color pb-2 mb-2">
                <SectorButton label="SORTIES" isActive={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                <SectorButton label="SYSTEMS" isActive={activeTab === 'status'} onClick={() => setActiveTab('status')} />
            </div>
            <div className="flex-grow overflow-y-auto p-2">
                {activeTab === 'projects' && <ProjectsTab />}
                {activeTab === 'status' && <StatusTab />}
            </div>
        </div>
    );
};

export default MFD;
