import React, { useState, useEffect } from 'react';
import { RoomData, DesignTier } from '@/utils/types';
import { createNewRoom } from '@/utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from '@/data/constants';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (newRoom: RoomData) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onAddRoom }) => {
  const [roomName, setRoomName] = useState('New Room');
  const [roomType, setRoomType] = useState('Conference Room');
  const [designTier, setDesignTier] = useState<DesignTier>('Silver');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoomBase = createNewRoom();
    const newRoom: RoomData = {
      ...newRoomBase,
      id: uuidv4(),
      roomName,
      roomType,
      designTier,
    };
    onAddRoom(newRoom);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-4 border-b border-border-color">
            <h2 className="text-xl font-bold">Add New Room</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="add-room-name" className="block text-sm font-medium">Room Name</label>
              <input
                id="add-room-name"
                type="text"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                required
                className="w-full p-2 border rounded-md bg-input-bg mt-1"
              />
            </div>
            <div>
              <label htmlFor="add-room-type" className="block text-sm font-medium">Room Type</label>
              <select
                id="add-room-type"
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
                className="w-full p-2 border rounded-md bg-input-bg mt-1"
              >
                {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Design Tier</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {DESIGN_TIER_OPTIONS.map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setDesignTier(tier)}
                    className={`p-2 border rounded-md ${designTier === tier ? 'border-accent bg-accent/10' : 'border-border-color'}`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 bg-background flex justify-end gap-3 border-t border-border-color">
            <button type="button" onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
            <button type="submit" className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Add Room</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
