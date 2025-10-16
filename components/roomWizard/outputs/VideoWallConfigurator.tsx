import React from 'react';
import { RoomWizardAnswers, VideoWallConfig, DisplayType } from '../../../utils/types.ts';
import WizardToggleOption from '../common/WizardToggleOption.tsx';
import WallLayoutDisplay from '../../WallLayoutDisplay.tsx';

interface VideoWallConfiguratorProps {
    answers: RoomWizardAnswers;
    updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const TECHNOLOGY_OPTIONS = [
    { id: 'avoip', name: 'AVoIP (Decoder per Screen)', description: 'A flexible solution using one decoder per panel. Ideal for multi-source and scalable walls.' },
    { id: 'processor', name: 'Dedicated Processor', description: 'A single hardware device drives all panels. Simple and reliable for single-source walls.' }
];

const VideoWallConfigurator: React.FC<VideoWallConfiguratorProps> = ({ answers, updateAnswers }) => {
    const config = answers.videoWallConfig;

    if (!config) return null;

    const updateConfig = (newConfig: Partial<VideoWallConfig>) => {
        const updatedConfig = { ...config, ...newConfig };
        // The useEffect in useRoomWizard will handle syncing displayType and displayCount.
        updateAnswers({ videoWallConfig: updatedConfig });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Video Wall Configuration</h3>
            
            {/* Wall Type */}
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Wall Type</label>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => updateConfig({ type: 'lcd' })} className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${config.type === 'lcd' ? 'border-accent bg-accent-bg-subtle shadow-md shadow-accent/20 ring-1 ring-accent' : 'border-border-color hover:border-accent-border-subtle'}`}>
                        <p className="font-bold">LCD</p>
                        <p className="text-xs text-text-secondary">Tiled panels with bezels</p>
                    </button>
                     <button onClick={() => updateConfig({ type: 'led' })} className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${config.type === 'led' ? 'border-accent bg-accent-bg-subtle shadow-md shadow-accent/20 ring-1 ring-accent' : 'border-border-color hover:border-accent-border-subtle'}`}>
                        <p className="font-bold">Direct-View LED</p>
                        <p className="text-xs text-text-secondary">Seamless, no bezels</p>
                    </button>
                </div>
            </div>

            {/* Layout (LCD only) */}
            {config.type === 'lcd' && (
                 <div className="grid grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="wall-cols" className="block text-sm font-medium">Columns</label>
                            <input type="number" id="wall-cols" min="1" max="16" value={config.layout.cols} onChange={(e) => updateConfig({ layout: { ...config.layout, cols: parseInt(e.target.value) || 1 } })} className="w-full p-2 border rounded-md bg-input-bg mt-1" />
                        </div>
                        <div>
                            <label htmlFor="wall-rows" className="block text-sm font-medium">Rows</label>
                            <input type="number" id="wall-rows" min="1" max="16" value={config.layout.rows} onChange={(e) => updateConfig({ layout: { ...config.layout, rows: parseInt(e.target.value) || 1 } })} className="w-full p-2 border rounded-md bg-input-bg mt-1" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-center mb-2">Layout Preview</p>
                        <WallLayoutDisplay rows={config.layout.rows} cols={config.layout.cols} />
                    </div>
                </div>
            )}

             {/* Driving Technology */}
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Driving Technology</label>
                <div className="space-y-3">
                     {TECHNOLOGY_OPTIONS.map(opt => (
                        <button key={opt.id} onClick={() => updateConfig({ technology: opt.id as 'avoip' | 'processor' })} className={`w-full text-left p-3 border-2 rounded-lg transition-all duration-200 ${config.technology === opt.id ? 'border-accent bg-accent-bg-subtle shadow-md shadow-accent/20 ring-1 ring-accent' : 'border-border-color hover:border-accent-border-subtle'}`}>
                            <p className="font-bold">{opt.name}</p>
                            <p className="text-sm text-text-secondary">{opt.description}</p>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Multiview */}
            <WizardToggleOption
                label="Multiview Required"
                description="Does the video wall need to display multiple sources simultaneously?"
                checked={config.multiviewRequired}
                onChange={(isChecked) => updateConfig({ multiviewRequired: isChecked })}
            />
        </div>
    );
};

export default VideoWallConfigurator;