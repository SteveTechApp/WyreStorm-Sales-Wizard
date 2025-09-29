import React from 'react';
import FunctionalityStatementPanel from './workspace/configurator/FunctionalityStatementPanel.tsx';
import EquipmentListPanel from './workspace/configurator/EquipmentListPanel.tsx';
import RoomActionsPanel from './workspace/configurator/RoomActionsPanel.tsx';

const RoomConfigurator: React.FC = () => {
    return (
        <div className="space-y-6">
            <RoomActionsPanel />
            <FunctionalityStatementPanel />
            <EquipmentListPanel />
        </div>
    );
};

export default RoomConfigurator;
