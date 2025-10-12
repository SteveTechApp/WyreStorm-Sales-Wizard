import React, { useMemo } from 'react';
import { useProjectContext } from '../../../context/ProjectContext.tsx';
import { useGenerationContext } from '../../../context/GenerationContext.tsx';
import WizardToggleOption from '../../roomWizard/common/WizardToggleOption.tsx';
import { toggleArrayItem } from '../../../utils/utils.ts';

const ENGINEERABLE_FEATURES = [
    { id: 'NO_WIRELESS_CASTING', label: 'Wireless Presentation', tags: ['Casting', 'Wireless'] },
    { id: 'NO_USB_KVM', label: 'USB KVM Extension', tags: ['USB', 'KVM', 'USB2.0', 'USB3.0', 'BYOM'] },
    { id: 'DOWNGRADE_4K', label: '4K60 4:4:4 Video', tags: ['4K60', '4:4:4'] },
    { id: 'DOWNGRADE_HDBT', label: 'HDBaseT 3.0', tags: ['HDBT3.0'] },
];

const ValueEngineeringPanel: React.FC = () => {
    const { projectData, activeRoomId } = useProjectContext();
    const { handleValueEngineerRoom } = useGenerationContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);

    const availableFeatures = useMemo(() => {
        if (!room || room.manuallyAddedEquipment.length === 0) return [];
        const allTags = new Set(room.manuallyAddedEquipment.flatMap(e => e.tags));
        return ENGINEERABLE_FEATURES.filter(feat => feat.tags.some(tag => allTags.has(tag)));
    }, [room]);

    if (!room || room.manuallyAddedEquipment.length === 0) {
        return null;
    }

    const handleToggle = (constraintId: string) => {
        if (!activeRoomId) return;
        const currentConstraints = room.valueEngineeringConstraints || [];
        const newConstraints = toggleArrayItem(currentConstraints, constraintId);
        handleValueEngineerRoom(activeRoomId, newConstraints);
    };

    return (
        <div className="bg-background-secondary p-6 rounded-xl shadow-xl border border-border-color">
            <h3 className="font-bold text-lg mb-2">Value Engineering</h3>
            <p className="text-xs text-text-secondary mb-4">
                Disable features to have the AI find cheaper product alternatives. The room will be re-designed automatically.
            </p>
            {availableFeatures.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableFeatures.map(feature => (
                        <WizardToggleOption
                            key={feature.id}
                            label={feature.label}
                            description={`Disable to remove this feature.`}
                            checked={!(room.valueEngineeringConstraints || []).includes(feature.id)}
                            onChange={() => handleToggle(feature.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-text-secondary text-center py-4">No value engineering options available for the current equipment selection.</p>
            )}
        </div>
    );
};

export default ValueEngineeringPanel;