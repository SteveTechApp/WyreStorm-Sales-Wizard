import React, { useState, useRef, useEffect } from 'react';
import { RoomData } from '../utils/types';
import { PlusCircleIcon, TrashIcon, BuildingIcon } from './Icons';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';

interface RoomSelectorDropdownProps {
  rooms: RoomData[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onAddRoom: () => void;
}

const RoomSelectorDropdown: React.FC<RoomSelectorDropdownProps> = ({ rooms, selectedRoomId, onSelectRoom, onAddRoom }) => {
  const { dispatchProjectAction } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
        dispatchProjectAction({ type: 'REMOVE_ROOM', payload: roomId });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 bg-background rounded-md border border-border-color hover:border-primary transition-colors"
      >
        <span className="font-bold text-text-primary truncate">{selectedRoom ? selectedRoom.roomName : 'Select a Room'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-background-secondary rounded-md shadow-lg border border-border-color z-50">
          <ul className="py-1 max-h-60 overflow-y-auto">
            {rooms.map(room => (
              <li key={room.id} className="group flex items-center justify-between hover:bg-background">
                <button
                  onClick={() => { onSelectRoom(room.id); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${selectedRoomId === room.id ? 'font-bold text-primary' : 'text-text-primary'}`}
                >
                    <BuildingIcon className="h-4 w-4 text-text-secondary" />
                    {room.roomName}
                </button>
                 <button onClick={() => handleDeleteRoom(room.id)} className="p-2 text-text-secondary hover:text-destructive opacity-0 group-hover:opacity-100"><TrashIcon className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
           <div className="p-2 border-t border-border-color">
                <button onClick={() => { onAddRoom(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 p-2 text-sm text-primary hover:bg-primary/10 rounded-md">
                    <PlusCircleIcon className="h-5 w-5" />
                    Add New Room
                </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelectorDropdown;