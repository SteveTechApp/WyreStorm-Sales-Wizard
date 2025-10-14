import React from 'react';
import { RoomWizardAnswers } from '../../utils/types.ts';
import { SWITCH_FEATURES } from '../../data/wizardOptions.ts';
import { toggleArrayItem } from '../../utils/utils.ts';
import WizardToggleOption from './common/WizardToggleOption.tsx';

interface StepAVoIPNetworkProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepAVoIPNetwork: React.FC<StepAVoIPNetworkProps> = ({ answers, updateAnswers }) => {
  const isAvoipSelected = answers.technicalDetails.avoipSystem && answers.technicalDetails.avoipSystem !== 'None';
  const networkDetails = answers.technicalDetails.avoipNetworkDetails || { useDedicatedNetwork: true, poeAvailable: true, switchFeatures: [] };

  const handleToggle = (name: 'useDedicatedNetwork' | 'poeAvailable') => (isChecked: boolean) => {
    updateAnswers({
      technicalDetails: {
        ...answers.technicalDetails,
        avoipNetworkDetails: { ...networkDetails, [name]: isChecked },
      },
    });
  };
  
  const handleFeatureChange = (featureId: string) => {
    const newFeatures = toggleArrayItem(networkDetails.switchFeatures as string[], featureId);
    updateAnswers({
      technicalDetails: {
        ...answers.technicalDetails,
        avoipNetworkDetails: { ...networkDetails, switchFeatures: newFeatures as any },
      },
    });
  };

  if (!isAvoipSelected) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">AVoIP Network</h2>
        <p className="text-text-secondary">This step is only required if an AVoIP system is selected in the 'Technical Details' step.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">AVoIP Network Details</h2>
      <p className="text-text-secondary mb-6">Specify details about the network that will support the AVoIP system.</p>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardToggleOption
                label="Use Dedicated AV Network"
                description="The AVoIP system will run on its own physically separate network switches."
                checked={networkDetails.useDedicatedNetwork}
                onChange={handleToggle('useDedicatedNetwork')}
            />
            <WizardToggleOption
                label="PoE+ Available on Switch"
                description="The network switch can provide Power over Ethernet to the endpoints."
                checked={networkDetails.poeAvailable}
                onChange={handleToggle('poeAvailable')}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Supported Network Switch Features</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SWITCH_FEATURES.map(feat => (
                    <div key={feat.id} className="flex items-center p-3 bg-background rounded-md border">
                        <input
                            type="checkbox"
                            id={`feature-${feat.id}`}
                            checked={networkDetails.switchFeatures.includes(feat.id as any)}
                            onChange={() => handleFeatureChange(feat.id)}
                            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <label htmlFor={`feature-${feat.id}`} className="ml-2 text-sm">{feat.label}</label>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StepAVoIPNetwork;