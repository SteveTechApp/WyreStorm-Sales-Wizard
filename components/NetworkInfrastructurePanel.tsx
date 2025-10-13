import React from 'react';
import { useProjectContext } from '../context/ProjectContext.tsx';
import InfoTooltip from './InfoTooltip.tsx';
import { ProjectInfrastructure } from '../utils/types.ts';
import ToggleSwitch from './ui/ToggleSwitch.tsx';

const NetworkInfrastructurePanel: React.FC = () => {
    const { projectData, dispatchProjectAction } = useProjectContext();
    
    const infrastructure = projectData?.infrastructure || {
        useDedicatedNetwork: false,
        enableTouchAppPreview: false,
        cablingByOthers: false,
    };

    const handleChange = (name: keyof ProjectInfrastructure, checked: boolean) => {
        const newInfra: ProjectInfrastructure = { ...infrastructure, [name]: checked };
        dispatchProjectAction({ type: 'UPDATE_INFRASTRUCTURE', payload: newInfra });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <label htmlFor="useDedicatedNetwork" className="text-sm font-medium text-text-secondary">Use Dedicated AV Network</label>
                    <InfoTooltip text="Specifies if the AV system will be on its own isolated network switch, or on the client's main network." />
                </div>
                <ToggleSwitch
                    checked={infrastructure.useDedicatedNetwork}
                    onChange={(isChecked) => handleChange('useDedicatedNetwork', isChecked)}
                />
            </div>
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <label htmlFor="enableTouchAppPreview" className="text-sm font-medium text-text-secondary">Enable Touch App Preview</label>
                    <InfoTooltip text="Enables the WyreStorm Touch App preview feature for controlling NetworkHD systems from a tablet." />
                </div>
                <ToggleSwitch
                    checked={infrastructure.enableTouchAppPreview}
                    onChange={(isChecked) => handleChange('enableTouchAppPreview', isChecked)}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <label htmlFor="cablingByOthers" className="text-sm font-medium text-text-secondary">Cabling by Others</label>
                     <InfoTooltip text="Indicates that the low-voltage cabling (e.g., Cat6) will be installed by a different contractor." />
                </div>
                <ToggleSwitch
                    checked={infrastructure.cablingByOthers}
                    onChange={(isChecked) => handleChange('cablingByOthers', isChecked)}
                />
            </div>
        </div>
    );
};

export default NetworkInfrastructurePanel;