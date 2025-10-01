import React from 'react';
import { DesignTier } from '@/types';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from '@/constants/room';

interface AddRoomFormProps {
  name: string;
  setName: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  tier: DesignTier;
  setTier: (value: DesignTier) => void;
}

export const AddRoomForm: React.FC<AddRoomFormProps> = ({ name, setName, type, setType, tier, setTier }) => (
  <div className="space-y-4">
    <div>
      <label htmlFor="add-room-name" className="block text-sm font-medium">Room Name</label>
      <input id="add-room-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded-md bg-input-bg mt-1" />
    </div>
    <div>
      <label htmlFor="add-room-type" className="block text-sm font-medium">Room Type</label>
      <select id="add-room-type" value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded-md bg-input-bg mt-1">
        {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium">Design Tier</label>
      <div className="grid grid-cols-3 gap-2 mt-1">
        {DESIGN_TIER_OPTIONS.map(t => (
          <button key={t} type="button" onClick={() => setTier(t)} className={`p-2 border rounded-md ${tier === t ? 'border-accent bg-accent/10' : 'border-border-color'}`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  </div>
);
