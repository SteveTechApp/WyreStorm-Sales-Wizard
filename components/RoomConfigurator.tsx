import React, { useState } from 'react';
import { RoomData } from '../utils/types';
import StepBasicInfo from './roomWizard/StepBasicInfo';
import StepFeatures from './roomWizard/StepFeatures';
import StepTechnical from './roomWizard/StepTechnical';
import StepEnvironment from './roomWizard/StepEnvironment';
import StepBudget from './roomWizard/StepBudget';
import { useAppContext } from '../context/AppContext';
import { ROOM_TYPES } from '../data/constants';
import { generateRoomDesign } from '../services/roomDesignerService';
import { SparklesIcon } from './Icons';

interface RoomConfiguratorProps {
  room: RoomData;
}

const RoomConfigurator: React.FC<RoomConfiguratorProps> = ({ room }) => {
  const { dispatchProjectAction, userProfile } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);

  // Adapt RoomData to the structure expected by the wizard steps
  const roomForEditing = {
    ...room,
    customRoomType: ROOM_TYPES.includes(room.roomType) ? '' : room.roomType,
    roomType: ROOM_TYPES.includes(room.roomType) ? room.roomType : 'Other',
  };

  const setAnswers = (updateFn: React.SetStateAction<any>) => {
    // Re-apply the logic from useRoomWizard when saving
    const tempRoom = typeof updateFn === 'function' ? updateFn(roomForEditing) : updateFn;
    const finalRoomData = {
        ...room, // start with original room to preserve things like equipment list
        ...tempRoom,
        roomType: tempRoom.roomType === 'Other' ? tempRoom.customRoomType || 'Custom' : tempRoom.roomType,
    };
    // Clean up temporary property
    delete (finalRoomData as any).customRoomType;
    dispatchProjectAction({ type: 'UPDATE_ROOM', payload: finalRoomData });
  };

  const handleGenerateClick = async () => {
    if (!userProfile) {
        alert("Please set up your user profile first.");
        return;
    }
    setIsGenerating(true);
    try {
        const design = await generateRoomDesign(room, userProfile);
        const updatedRoom = { ...room, ...design };
        dispatchProjectAction({ type: 'UPDATE_ROOM', payload: updatedRoom });
        alert("AI Design complete! Check the 'Equipment & Connectivity' tab to see the results.");
    } catch (e) {
        console.error("Failed to generate room design:", e);
        alert("An error occurred while generating the design. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <p className="text-text-secondary max-w-lg">
                Edit the room's core details below, or let the AI generate an equipment list based on these settings.
            </p>
            <button
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="flex-shrink-0 flex items-center gap-2 bg-accent/80 hover:bg-accent text-text-on-accent font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400"
            >
                <SparklesIcon className="h-5 w-5" />
                {isGenerating ? 'Generating...' : 'Auto-Design Equipment'}
            </button>
        </div>
        <div className="space-y-8 p-4 bg-background rounded-lg border border-border-color">
            <StepBasicInfo answers={roomForEditing} setAnswers={setAnswers} />
            <StepFeatures answers={room} setAnswers={setAnswers as any} />
            <StepTechnical answers={room} setAnswers={setAnswers as any} />
            <StepEnvironment answers={room} setAnswers={setAnswers as any} />
            <StepBudget answers={room} setAnswers={setAnswers as any} />
        </div>
    </div>
  );
};

export default RoomConfigurator;