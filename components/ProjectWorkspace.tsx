import React, { useState } from 'react';
import WorkspaceHeader from './workspace/WorkspaceHeader.tsx';
import RoomSummaryPanel from './workspace/RoomSummaryPanel.tsx';
import FunctionalityStatementPanel from './workspace/configurator/FunctionalityStatementPanel.tsx';
import AIDesignActionPanel from './workspace/configurator/AIDesignActionPanel.tsx';
import ValueEngineeringPanel from './workspace/configurator/ValueEngineeringPanel.tsx';
import EquipmentListPanel from './workspace/configurator/EquipmentListPanel.tsx';
import IOConfigurationPanel from './io/IOConfigurationPanel.tsx';
import IOWizardModal from './io/IOWizardModal.tsx';
import SystemDiagram from './SystemDiagram.tsx';
import { useProjectContext } from '../context/ProjectContext.tsx';

const ProjectWorkspace: React.FC = () => {
    const { projectData, activeRoomId } = useProjectContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);

    const [isIOWizardOpen, setIsIOWizardOpen] = useState(false);

    if (!room) {
        return null; // Or a loading/empty state for the room
    }

    return (
        <>
            <div className="flex flex-col gap-6 animate-fade-in-fast">
                <WorkspaceHeader />
                <RoomSummaryPanel />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left Column: Configuration */}
                    <div className="space-y-6">
                        <FunctionalityStatementPanel />
                        <AIDesignActionPanel />
                        <ValueEngineeringPanel />
                        <EquipmentListPanel />
                        <IOConfigurationPanel onOpenWizard={() => setIsIOWizardOpen(true)} />
                    </div>
                    {/* Right Column: Visualization */}
                    <div className="lg:sticky lg:top-6">
                        <SystemDiagram diagram={room?.systemDiagram} />
                    </div>
                </div>
            </div>
            <IOWizardModal 
                isOpen={isIOWizardOpen}
                onClose={() => setIsIOWizardOpen(false)}
                room={room}
            />
        </>
    );
};

export default ProjectWorkspace;