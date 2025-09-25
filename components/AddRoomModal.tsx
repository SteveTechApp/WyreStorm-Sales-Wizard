import React from 'react';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
// FIX: Add file extension to satisfy module resolution for types.ts
import { RoomData } from '../utils/types.ts';
import RoomWizard from './RoomWizard.tsx';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose }) => {
  const { dispatchProjectAction } = useAppContext();
  
  const handleSaveRoom = (roomData: RoomData) => {
    dispatchProjectAction({ type: 'ADD_ROOM', payload: roomData });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-3xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">Add New Room</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto">
            <RoomWizard onSave={handleSaveRoom} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;