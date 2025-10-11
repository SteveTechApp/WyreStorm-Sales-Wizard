import React from 'react';
import { RoomWizardAnswers } from '../../utils/types.ts';
import IOSection from './basicInfo/IOSection.tsx';
import ToggleSwitch from '../ui/ToggleSwitch.tsx';
import { CAMERA_TYPES } from '../../data/wizardOptions.ts';

interface StepSourcesProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const FeatureToggle: React.FC<{
    label: string,
    description: string,
    featureName: string,
    answers: RoomWizardAnswers,
    updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}> = ({ label, description, featureName, answers, updateAnswers }) => {

    const handleFeatureToggle = (isEnabled: boolean) => {
        let newFeatures = [...answers.features];
        const featureExists = newFeatures.some(f => f.name === featureName);

        if (isEnabled && !featureExists) {
            newFeatures.push({ name: featureName, priority: 'must-have' });
        } else if (!isEnabled && featureExists) {
            newFeatures = newFeatures.filter(f => f.name !== featureName);
        }
        updateAnswers({ features: newFeatures });
    };

    return (
        <div className="flex items-center justify-between p-3 bg-background rounded-md border border-border-color">
            <div>
                <label className="text-sm font-medium">{label}</label>
                <p className="text-xs text-text-secondary">{description}</p>
            </div>
            <ToggleSwitch
                checked={answers.features.some(f => f.name === featureName)}
                onChange={handleFeatureToggle}
            />
        </div>
    );
};

const StepSources: React.FC<StepSourcesProps> = ({ answers, updateAnswers }) => {

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
                        <FeatureToggle 
                            label="Wireless Presentation"
                            description="Allow users to share content wirelessly."
                            featureName="Wireless Presentation"
                            answers={answers}
                            updateAnswers={updateAnswers}
                        />
                         <div className="flex items-center justify-between p-3 bg-background rounded-md border border-border-color">
                            <div>
                                <label htmlFor="room-pc" className="text-sm font-medium">Dedicated Room PC</label>
                                <p className="text-xs text-text-secondary">Include a dedicated in-room computer.</p>
                            </div>
                            <ToggleSwitch
                                checked={answers.technicalDetails.roomPc}
                                onChange={handleRoomPcToggle}
                            />
                        </div>
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
