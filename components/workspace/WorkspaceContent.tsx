import React from 'react';
// FIX: Corrected import path
import RoomConfigurator from '../RoomConfigurator.tsx';
// FIX: Corrected import path
import SystemDiagram from '../SystemDiagram.tsx';
import VisualRoomPlanner from '../VisualRoomPlanner.tsx';
import IoPanel from '../io/IoPanel.tsx';
import { useProjectContext } from '../../context/ProjectContext.tsx';

interface WorkspaceContentProps {
  activeTab: string;
}

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({ activeTab }) => {
    const { projectData, activeRoomId } = useProjectContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);

    switch (activeTab) {
        case 'config':
            return <RoomConfigurator />;
        case 'io':
            return <IoPanel />;
        case 'diagram':
            return <SystemDiagram diagram={room?.systemDiagram} />;
        case 'planner':
            return <VisualRoomPlanner />;
        default:
            return <div>Select a tab</div>;
    }
};

export default WorkspaceContent;