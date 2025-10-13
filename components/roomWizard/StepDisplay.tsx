import React, { useState } from 'react';
import { RoomWizardAnswers, VideoWallConfig } from '../../utils/types.ts';
import { DISPLAY_TYPES } from '../../data/wizardOptions.ts';
import VideoWallWizardModal from './VideoWallWizardModal.tsx';

interface StepDisplayProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepDisplay: React.FC<StepDisplayProps> = ({ answers, updateAnswers }) => {
    const [isVideoWallWizardOpen, setIsVideoWallWizardOpen] = useState(false);

    const isLFD = answers.displayType === 'single' || answers.displayType === 'dual_display';
    const isVideoWall = answers.displayType === 'lcd_video_wall' || answers.displayType === 'led_video_wall';

    const handleSaveVideoWall = (config: VideoWallConfig) => {
        const newDisplayCount = config.layout.rows * config.layout.cols;
        updateAnswers({ videoWallConfig: config, displayCount: newDisplayCount });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Display System</h2>
            <p className="text-text-secondary mb-6">Define the primary display system for the room.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="display-type" className="block text-sm font-medium text-text-secondary">Display Type</label>
                    <select
                        id="display-type"
                        value={answers.displayType}
                        onChange={(e) => updateAnswers({ displayType: e.target.value as any })}
                        className="w-full p-2 border rounded-md bg-input-bg mt-1 border-border-color"
                    >
                        {DISPLAY_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="display-count" className="block text-sm font-medium text-text-secondary">Display Count</label>
                    <input
                        type="number"
                        id="display-count"
                        min="1"
                        value={answers.displayCount}
                        onChange={(e) => updateAnswers({ displayCount: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 border rounded-md bg-input-bg mt-1"
                        readOnly={isVideoWall}
                    />
                </div>
                {isLFD && (
                     <div>
                        <label htmlFor="display-size" className="block text-sm font-medium text-text-secondary">LFD Size (inches)</label>
                        <input
                            type="number"
                            id="display-size"
                            min="32"
                            step="1"
                            value={answers.displaySize || 75}
                            onChange={(e) => updateAnswers({ displaySize: parseInt(e.target.value) || 75 })}
                            className="w-full p-2 border rounded-md bg-input-bg mt-1"
                        />
                    </div>
                )}
            </div>
            {isVideoWall && (
                <div className="mt-6 text-center">
                    <button onClick={() => setIsVideoWallWizardOpen(true)} className="btn btn-secondary">
                        Configure Video Wall Layout
                    </button>
                </div>
            )}
             <VideoWallWizardModal
                isOpen={isVideoWallWizardOpen}
                onClose={() => setIsVideoWallWizardOpen(false)}
                onSave={handleSaveVideoWall}
            />
        </div>
    );
};

export default StepDisplay;