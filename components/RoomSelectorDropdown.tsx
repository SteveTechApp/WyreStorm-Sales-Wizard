import React, { useState, useRef, useEffect } from 'react';
import { RoomData } from '../utils/types';
import { PlusCircleIcon, TrashIcon } from './Icons';

interface RoomSelectorDropdownProps {
  rooms: RoomData[];
  selectedRoom: RoomData;
  onSelectRoom: (roomId: string) => void;
  onRemoveRoom: (roomId: string) => void;
  onAddRoom: () => void;
}

const RoomSelectorDropdown: React.FC<RoomSelectorDropdownProps> = ({ rooms, selectedRoom, onSelectRoom, onRemoveRoom, onAddRoom }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (roomId: string) => {
    onSelectRoom(roomId);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-background transition-colors"
      >
        <span className="text-xl font-bold text-text-primary">{selectedRoom.roomName}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-72 bg-background-secondary rounded-md shadow-lg border border-border-color z-50 animate-fade-in-fast">
          <ul className="py-1 max-h-64 overflow-y-auto">
            {rooms.map(room => (
              <li key={room.id}>
                <button
                  onClick={() => handleSelect(room.id)}
                  className={`w-full text-left px-4 py-2 text-sm flex justify-between items-center ${
                    selectedRoom.id === room.id ? 'font-bold text-primary' : 'text-text-primary'
                  } hover:bg-background`}
                >
                  <span>{room.roomName}</span>
                  {selectedRoom.id !== room.id && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveRoom(room.id); }} 
                        className="p-1 text-text-secondary hover:text-destructive rounded-full opacity-50 hover:opacity-100"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-border-color p-2">
            <button
              onClick={() => { onAddRoom(); setIsOpen(false); }}
              className="w-full flex items-center gap-2 p-2 text-sm text-primary hover:bg-background rounded-md"
            >
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
