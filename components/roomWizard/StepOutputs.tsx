import React, { useState } from 'react';
import { RoomWizardAnswers, VideoWallConfig } from '../../utils/types.ts';
import { MAIN_DISPLAY_OPTIONS } from '../../data/wizardOptions.ts';
import { toggleFeature } from '../../utils/utils.ts';
import DisplayTypeCard from './outputs/DisplayTypeCard.tsx';
import DisplayConfig from './outputs/DisplayConfig.tsx';
import VideoWallConfigurator from './outputs/VideoWallConfigurator.tsx';

interface StepOutputsProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepOutputs: React.FC<StepOutputsProps> = ({ answers, updateAnswers }) => {
    // Determine the current selection based on the room's answers state
    const determineSelection = (): string => {
        if (answers.videoWallConfig) return 'video_wall';
        if (answers.displayType === 'projector') {
            return answers.displayCount > 1 ? 'dual_projector' : 'projector';
        }
        if (answers.features.some(f => f.name === 'Interactive Display')) {
            return 'interactive_lfd';
        }
        if (answers.displayType === 'dual_display') {
            return 'dual_lfd';
        }
        return 'single_lfd';
    };

    const [selectedType, setSelectedType] = useState(determineSelection);

    const handleSelectType = (typeId: string) => {
        setSelectedType(typeId);

        let newAnswers: Partial<RoomWizardAnswers> = {};
        
        // Always reset video wall config unless it's selected
        if (typeId !== 'video_wall' && answers.videoWallConfig) {
            const { videoWallConfig, ...rest } = answers as any; // Temporary to allow deletion
            updateAnswers({ ...rest, videoWallConfig: undefined });
        }

        // Reset interactivity unless it's selected
        const isInteractive = answers.features.some(f => f.name === 'Interactive Display');
        if (typeId !== 'interactive_lfd' && isInteractive) {
            newAnswers.features = answers.features.filter(f => f.name !== 'Interactive Display');
        }

        switch (typeId) {
            case 'single_lfd':
                newAnswers = { ...newAnswers, displayType: 'single', displayCount: 1 };
                break;
            case 'dual_lfd':
                newAnswers = { ...newAnswers, displayType: 'dual_display', displayCount: 2 };
                break;
            case 'interactive_lfd':
                newAnswers = { ...newAnswers, displayType: 'single', displayCount: 1, features: toggleFeature(answers.features, 'Interactive Display', true) };
                break;
            case 'projector':
                newAnswers = { ...newAnswers, displayType: 'projector', displayCount: 1 };
                break;
            case 'dual_projector':
                newAnswers = { ...newAnswers, displayType: 'projector', displayCount: 2 };
                break;
            case 'video_wall':
                newAnswers.displayType = 'lcd_video_wall'; // default
                if (!answers.videoWallConfig) {
                     const defaultConfig: VideoWallConfig = {
                        type: 'lcd',
                        layout: { rows: 2, cols: 2 },
                        technology: 'avoip',
                        multiviewRequired: false
                    };
                    newAnswers.videoWallConfig = defaultConfig;
                }
                break;
        }

        updateAnswers(newAnswers);
    };

    const showDisplayConfig = ['single_lfd', 'dual_lfd', 'interactive_lfd', 'projector', 'dual_projector'].includes(selectedType);
    const showVideoWallConfig = selectedType === 'video_wall';
    const isProjector = selectedType === 'projector' || selectedType === 'dual_projector';

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Main Display Configuration</h2>
            <p className="text-text-secondary mb-6">Select the primary display type for this room. The AI will use this to select appropriate equipment.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MAIN_DISPLAY_OPTIONS.map(opt => (
                    <DisplayTypeCard
                        key={opt.id}
                        {...opt}
                        onClick={() => handleSelectType(opt.id)}
                        isSelected={selectedType === opt.id}
                    />
                ))}
            </div>

            {showDisplayConfig && <DisplayConfig answers={answers} updateAnswers={updateAnswers} isProjector={isProjector} />}
            {showVideoWallConfig && (
                 <div className="mt-6 pt-6 border-t border-border-color">
                    <VideoWallConfigurator answers={answers} updateAnswers={updateAnswers} />
                 </div>
            )}
        </div>
    );
};

export default StepOutputs;