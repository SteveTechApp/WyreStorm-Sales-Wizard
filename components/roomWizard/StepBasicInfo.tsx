import React, { useState } from 'react';
import { RoomWizardAnswers } from '../../utils/types.ts';
import RoomDetailsInputs from './basicInfo/RoomDetailsInputs.tsx';
import RoomSpecsInputs from './basicInfo/RoomSpecsInputs.tsx';
import DesignTierSelector from './basicInfo/DesignTierSelector.tsx';
import IOSection from './basicInfo/IOSection.tsx';
import VideoWallWizardModal from '../roomWizard/VideoWallWizardModal.tsx';

interface StepBasicInfoProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ answers, updateAnswers }) => {
  const [isVWWizardOpen, setIsVWWizardOpen] = useState(false);
  const isVideoWall = answers.displayType === 'lcd_video_wall' || answers.displayType === 'led_video_wall';

  return (
    <div className="space-y-8">
      <RoomDetailsInputs answers={answers} updateAnswers={updateAnswers} />
      
      {isVideoWall && (
        <div className="text-center p-4 bg-background border rounded-lg animate-fade-in-fast">
          <p className="font-semibold">Video Wall Detected</p>
          <p className="text-sm text-text-secondary mb-2">Additional configuration is required for this display type.</p>
          <button 
            type="button" 
            onClick={() => setIsVWWizardOpen(true)} 
            className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md text-sm"
          >
            {answers.videoWallConfig ? 'Re-Configure Video Wall' : 'Configure Video Wall'}
          </button>
        </div>
      )}

      <RoomSpecsInputs answers={answers} updateAnswers={updateAnswers} />
      <DesignTierSelector answers={answers} updateAnswers={updateAnswers} />
      <IOSection answers={answers} updateAnswers={updateAnswers} />

      <VideoWallWizardModal 
        isOpen={isVWWizardOpen}
        onClose={() => setIsVWWizardOpen(false)}
        onSave={(config) => {
            updateAnswers({ videoWallConfig: config });
            setIsVWWizardOpen(false);
        }}
      />
    </div>
  );
};

export default StepBasicInfo;