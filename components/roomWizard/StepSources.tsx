import React from 'react';
import { RoomWizardAnswers } from '../../utils/types.ts';
import IOSection from './basicInfo/IOSection.tsx';
import { CAMERA_TYPES } from '../../data/wizardOptions.ts';
import WizardToggleOption from './common/WizardToggleOption.tsx';
import { toggleFeature } from '../../utils/utils.ts';

interface StepSourcesProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepSources: React.FC<StepSourcesProps> = ({ answers, updateAnswers }) => {

    const handleFeatureToggle = (featureName: string) => (isEnabled: boolean) => {
        const newFeatures = toggleFeature(answers.features, featureName, isEnabled);
        updateAnswers({ features: newFeatures });
    };

    const handleTechChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseInt(value) : value;

        updateAnswers({ 
            technicalDetails: {
                ...answers.technicalDetails,
                [name]: finalValue,
            }
        });
    };

    const handleRoomPcToggle = (isEnabled: boolean) => {
         updateAnswers({ 
            technicalDetails: {
                ...answers.technicalDetails,
                roomPc: isEnabled,
            }
        });
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-text-primary">Source Devices & Features</h2>
                <p className="text-text-secondary mb-6">Define where signals will come from and what key features are required.</p>
                <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <WizardToggleOption
                            label="Wireless Presentation"
                            description="Allow users to share content wirelessly."
                            checked={answers.features.some(f => f.name === 'Wireless Presentation')}
                            onChange={handleFeatureToggle('Wireless Presentation')}
                        />
                        <WizardToggleOption
                            label="Dedicated Room PC"
                            description="Include a dedicated in-room computer."
                            htmlForId="room-pc"
                            checked={answers.technicalDetails.roomPc}
                            onChange={handleRoomPcToggle}
                        />
                     </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="camera-type" className="block text-sm font-medium text-text-secondary">Camera Type</label>
                            <select id="camera-type" name="cameraType" value={answers.technicalDetails.cameraType} onChange={handleTechChange} className="w-full p-2 border rounded-md bg-input-bg mt-1">
                                {CAMERA_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="camera-count" className="block text-sm font-medium text-text-secondary">Camera Count</label>
                            <input type="number" id="camera-count" name="cameraCount" min="0" value={answers.technicalDetails.cameraCount} onChange={handleTechChange} className="w-full p-2 border rounded-md bg-input-bg mt-1" />
                        </div>
                    </div>
                </div>
            </div>
            <IOSection answers={answers} updateAnswers={updateAnswers} />
        </div>
    );
};

export default StepSources;
