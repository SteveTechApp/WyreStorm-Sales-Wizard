import React from 'react';
import { useProjectContext } from '@/context/ProjectContext';
import InfoTooltip from './InfoTooltip';
import { ProjectInfrastructure } from '@/utils/types';

const NetworkInfrastructurePanel: React.FC = () => {
    const { projectData, dispatchProjectAction } = useProjectContext();
    
    const infrastructure = projectData?.infrastructure || {
        useDedicatedNetwork: false,
        enableTouchAppPreview: false,
        cablingByOthers: false,
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
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
                <input
                    type="checkbox"
                    id="useDedicatedNetwork"
                    name="useDedicatedNetwork"
                    checked={infrastructure.useDedicatedNetwork}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <label htmlFor="cablingByOthers" className="text-sm font-medium text-text-secondary">Cabling by Others</label>
                     <InfoTooltip text="Indicates that the low-voltage cabling (e.g., Cat6) will be installed by a different contractor." />
                </div>
                <input
                    type="checkbox"
                    id="cablingByOthers"
                    name="cablingByOthers"
                    checked={infrastructure.cablingByOthers}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
            </div>
        </div>
    );
};

export default NetworkInfrastructurePanel;
