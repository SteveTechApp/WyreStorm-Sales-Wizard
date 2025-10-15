import React from 'react';
import { VideoWallConfig } from '../../../utils/types.ts';
import WallLayoutDisplay from '../../WallLayoutDisplay.tsx';

interface StepLayoutProps {
  config: VideoWallConfig;
  updateConfig: (newConfig: Partial<VideoWallConfig>) => void;
}

const StepLayout: React.FC<StepLayoutProps> = ({ config, updateConfig }) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ type: e.target.value as 'lcd' | 'led' });
  };

  return (
    <div className="grid grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <div>
          <label htmlFor="wall-type" className="block text-sm font-medium">Display Technology</label>
          <select
            id="wall-type"
            value={config.type}
            onChange={handleTypeChange}
            className="w-full p-2 border rounded-md bg-input-bg mt-1"
          >
            <option value="lcd">LCD Video Wall</option>
            <option value="led">Direct-View LED</option>
          </select>
        </div>
        <div>
          <label htmlFor="wall-cols" className="block text-sm font-medium">Columns</label>
          <input
            type="number"
            id="wall-cols"
            min="1" max="16"
            value={config.layout.cols}
            onChange={(e) => updateConfig({ layout: { ...config.layout, cols: parseInt(e.target.value) || 1 } })}
            className="w-full p-2 border rounded-md bg-input-bg mt-1"
          />
        </div>
        <div>
          <label htmlFor="wall-rows" className="block text-sm font-medium">Rows</label>
          <input
            type="number"
            id="wall-rows"
            min="1" max="16"
            value={config.layout.rows}
            onChange={(e) => updateConfig({ layout: { ...config.layout, rows: parseInt(e.target.value) || 1 } })}
            className="w-full p-2 border rounded-md bg-input-bg mt-1"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-center mb-2">Layout Preview</p>
        <WallLayoutDisplay rows={config.layout.rows} cols={config.layout.cols} />
      </div>
    </div>
  );
};

export default StepLayout;