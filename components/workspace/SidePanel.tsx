import React from 'react';
import RoomDetailsPanel from '../RoomDetailsPanel.tsx';
import AIInsightsPanel from '../AIInsightsPanel.tsx';
import ProjectNotesPanel from '../ProjectNotesPanel.tsx';
import ConnectivityGraphic from '../ConnectivityGraphic.tsx';
import InfrastructurePanel from '../InfrastructurePanel.tsx';

const SidePanel: React.FC = () => {
    return (
        <div className="w-full lg:w-96 flex-shrink-0 space-y-4">
            <RoomDetailsPanel />
            <AIInsightsPanel />
            <ConnectivityGraphic />
            <InfrastructurePanel />
            <ProjectNotesPanel />
        </div>
    );
};

export default SidePanel;