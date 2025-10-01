import React from 'react';
import FunctionalityStatementPanel from './workspace/configurator/FunctionalityStatementPanel';
import EquipmentListPanel from './workspace/configurator/EquipmentListPanel';
import RoomActionsPanel from './workspace/configurator/RoomActionsPanel';

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
