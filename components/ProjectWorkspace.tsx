import React, { useState } from 'react';
import WorkspaceHeader from './workspace/WorkspaceHeader.tsx';
import WorkspaceTabs from './workspace/WorkspaceTabs.tsx';
import WorkspaceContent from './workspace/WorkspaceContent.tsx';
import SidePanel from './workspace/SidePanel.tsx';
import RoomConfigurator from './RoomConfigurator.tsx';
import IoPanel from './io/IoPanel.tsx';
import SystemDiagram from './SystemDiagram.tsx';
import VisualRoomPlanner from './VisualRoomPlanner.tsx';

const TABS_CONFIG = [
  { id: 'config', label: 'Configuration', component: RoomConfigurator },
  { id: 'io', label: 'I/O List', component: IoPanel },
  { id: 'diagram', label: 'Diagram', component: SystemDiagram },
  { id: 'planner', label: 'Planner', component: VisualRoomPlanner },
];

const ProjectWorkspace: React.FC = () => {
    const [activeTab, setActiveTab] = useState('config');

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-fast">
            <div className="flex-grow space-y-6">
                <WorkspaceHeader />
                <WorkspaceTabs tabs={TABS_CONFIG} activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-6">
                    <WorkspaceContent tabs={TABS_CONFIG} activeTab={activeTab} />
                </div>
            </div>
            <SidePanel />
        </div>
    );
};

export default ProjectWorkspace;
