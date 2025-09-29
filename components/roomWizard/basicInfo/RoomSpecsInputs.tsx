import React from 'react';
import { RoomWizardAnswers } from '../../../utils/types.ts';

interface RoomSpecsInputsProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const RoomSpecsInputs: React.FC<RoomSpecsInputsProps> = ({ answers, updateAnswers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label htmlFor="room-length" className="block text-sm font-medium text-text-secondary">Length (m)</label>
        <input
          type="number"
          id="room-length"
          value={answers.dimensions.length}
          onChange={(e) => updateAnswers({ dimensions: { ...answers.dimensions, length: Number(e.target.value) } })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        />
      </div>
      <div>
        <label htmlFor="room-width" className="block text-sm font-medium text-text-secondary">Width (m)</label>
        <input
          type="number"
          id="room-width"
          value={answers.dimensions.width}
          onChange={(e) => updateAnswers({ dimensions: { ...answers.dimensions, width: Number(e.target.value) } })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        />
      </div>
      <div>
        <label htmlFor="room-height" className="block text-sm font-medium text-text-secondary">Height (m)</label>
        <input
          type="number"
          id="room-height"
          value={answers.dimensions.height}
          onChange={(e) => updateAnswers({ dimensions: { ...answers.dimensions, height: Number(e.target.value) } })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        />
      </div>
      <div>
        <label htmlFor="room-participants" className="block text-sm font-medium text-text-secondary">Max Participants</label>
        <input
          type="number"
          id="room-participants"
          value={answers.maxParticipants}
          onChange={(e) => updateAnswers({ maxParticipants: Number(e.target.value) })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        />
      </div>
    </div>
  );
};

export default RoomSpecsInputs;