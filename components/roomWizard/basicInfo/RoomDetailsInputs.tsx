import React from 'react';
import { RoomWizardAnswers } from '../../../utils/types.ts';
import { ROOM_TYPES, DISPLAY_TYPES } from '../../../data/constants.ts';

interface RoomDetailsInputsProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const RoomDetailsInputs: React.FC<RoomDetailsInputsProps> = ({ answers, updateAnswers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <label htmlFor="room-name" className="block text-sm font-medium text-text-secondary">Room Name</label>
        <input
          type="text"
          id="room-name"
          value={answers.roomName}
          onChange={(e) => updateAnswers({ roomName: e.target.value })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        />
      </div>
      <div>
        <label htmlFor="room-type" className="block text-sm font-medium text-text-secondary">Room Type</label>
        <select
          id="room-type"
          value={answers.roomType}
          onChange={(e) => updateAnswers({ roomType: e.target.value })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        >
          {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
       <div>
        <label htmlFor="display-type" className="block text-sm font-medium text-text-secondary">Primary Display Type</label>
        <select
          id="display-type"
          value={answers.displayType}
          onChange={(e) => updateAnswers({ displayType: e.target.value })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        >
            {DISPLAY_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
        </select>
      </div>
    </div>
  );
};

export default RoomDetailsInputs;