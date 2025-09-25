import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { ProjectInfrastructure } from '../utils/types';

const NetworkInfrastructurePanel: React.FC = () => {
    const { projectData, dispatchProjectAction } = useAppContext();

    if (!projectData) return null;

    const infrastructure = projectData.infrastructure || {
        useDedicatedNetwork: false,
        enableTouchAppPreview: false,
        cablingByOthers: false,
    };

    const handleChange = (field: keyof ProjectInfrastructure, value: boolean) => {
        dispatchProjectAction({
            type: 'UPDATE_INFRASTRUCTURE',
            payload: { ...infrastructure, [field]: value }
        });
    };

    const CheckboxItem: React.FC<{ field: keyof ProjectInfrastructure; label: string; description: string }> = ({ field, label, description }) => (
        <label className="flex items-start gap-3 p-3 bg-background rounded-md border border-border-color/50 cursor-pointer hover:bg-border-color/20">
            <input
                type="checkbox"
                checked={!!infrastructure[field]}
                onChange={(e) => handleChange(field, e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-primary focus:ring-primary border-border-color"
            />
            <div>
                <span className="font-semibold text-text-primary">{label}</span>
                <p className="text-xs text-text-secondary">{description}</p>
            </div>
        </label>
    );

    return (
        <div className="bg-background-secondary p-4 rounded-lg border border-border-color">
            <h3 className="text-lg font-bold text-text-primary mb-3">Network & Cabling</h3>
            <div className="space-y-3">
                <CheckboxItem
                    field="useDedicatedNetwork"
                    label="Use Dedicated AV Network"
                    description="A dedicated, managed network switch (or a correctly configured VLAN on the corporate network) is required for all NetworkHD (AVoIP) deployments."
                />
                <CheckboxItem
                    field="enableTouchAppPreview"
                    label="Enable NetworkHD TouchApp Previews"
                    description="Allows for video stream previews on the control app. Requires a specific network configuration on the NHD-CTL-PRO."
                />
                <CheckboxItem
                    field="cablingByOthers"
                    label="Structured Cabling by Others"
                    description="Check this if the installation of low-voltage cabling (e.g., Cat6, speaker wire) is outside the scope of this project."
                />
            </div>
        </div>
    );
};

export default NetworkInfrastructurePanel;
