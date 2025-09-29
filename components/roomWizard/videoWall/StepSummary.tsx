import React from 'react';
import { VideoWallConfig } from '../../../utils/types';
import WallLayoutDisplay from '../../WallLayoutDisplay';

interface StepSummaryProps {
  config: VideoWallConfig;
}

const StepSummary: React.FC<StepSummaryProps> = ({ config }) => {
  return (
    <div>
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-2 gap-4 bg-background p-4 rounded-lg">
            <div>
                <p><strong>Layout:</strong> {config.layout.cols} x {config.layout.rows}</p>
                <p><strong>Type:</strong> {config.type.toUpperCase()}</p>
                <p><strong>Technology:</strong> {config.technology}</p>
            </div>
            <WallLayoutDisplay rows={config.layout.rows} cols={config.layout.cols} />
        </div>
    </div>
  );
};

export default StepSummary;
