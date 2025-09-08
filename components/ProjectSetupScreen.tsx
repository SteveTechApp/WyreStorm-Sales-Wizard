import React, { useState } from 'react';
import { UserProfile, RoomData, createDefaultRoomData } from '../types';
import { ProjectSetupData } from '../App';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from '../constants';
import { generateInspiredRoomDesign } from '../services/geminiService';
import TierTooltip from './TierTooltip';

interface ProjectSetupScreenProps {
  onSubmit: (data: ProjectSetupData) => void;
  onBack: () => void;
  defaultProjectName: string;
  userProfile: UserProfile | null;
}

const TIER_BUTTON_STYLES: Record<string, string> = {
    'Bronze': 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
    'Silver': 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    'Gold': 'bg-amber-100 hover:bg-amber-200 text-amber-800',
};

const ProjectSetupScreen: React.FC<ProjectSetupScreenProps> = ({ onSubmit, onBack, defaultProjectName, userProfile }) => {
  const [projectName, setProjectName] = useState(defaultProjectName);
  const [clientName, setClientName] = useState('');
  const [clientContactName, setClientContactName] = useState('');
  const [clientContactEmail, setClientContactEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [projectBudget, setProjectBudget] = useState<number | undefined>();
  
  const [rooms, setRooms] = useState<Omit<RoomData, 'id'>[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState(ROOM_TYPES[0]);
  const [quantity, setQuantity] = useState(1);
  const [loadingInspiration, setLoadingInspiration] = useState<string | null>(null);

  const handleAddPlaceholders = () => {
    if (quantity < 1) return;

    const newPlaceholders: Omit<RoomData, 'id'>[] = [];
    const existingCount = rooms.filter(r => r.roomType === selectedRoomType).length;

    for (let i = 1; i <= quantity; i++) {
      const roomName = `${selectedRoomType} ${existingCount + i}`;
      newPlaceholders.push(createDefaultRoomData(selectedRoomType, roomName));
    }
    setRooms(prev => [...prev, ...newPlaceholders]);
  };

  const handleInspireMe = async (designTier: 'Bronze' | 'Silver' | 'Gold') => {
    setLoadingInspiration(`${selectedRoomType}-${designTier}`);
    try {
        const inspiredRoom = await generateInspiredRoomDesign(selectedRoomType, designTier);
        
        let potentialName = inspiredRoom.roomName;
        const baseName = inspiredRoom.roomName;
        let counter = 1;
        while(rooms.some(r => r.roomName === potentialName)) {
            counter++;
            potentialName = `${baseName} (${counter})`;
        }
        inspiredRoom.roomName = potentialName;

        setRooms(prev => [...prev, inspiredRoom]);
    } catch (error) {
        console.error(`Failed to get inspiration for ${selectedRoomType}`, error);
    } finally {
        setLoadingInspiration(null);
    }
  };

  const handleRemoveRoom = (index: number) => {
    setRooms(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalRooms = rooms;
    if (finalRooms.length === 0) {
        finalRooms = [createDefaultRoomData('Conference Room', 'Conference Room')];
    }
    onSubmit({ projectName, clientName, clientContactName, clientContactEmail, clientAddress, coverImage, projectBudget, rooms: finalRooms });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#008A3A] mb-2">New Project Setup</h2>
      <p className="text-gray-600 mb-6">Define the high-level details and scope of your project.</p>
      
      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
              <label htmlFor="projectBudget" className="block text-sm font-medium text-gray-700 mb-1">Overall Project Budget ({userProfile?.currency})</label>
              <input type="number" id="projectBudget" value={projectBudget || ''} onChange={e => setProjectBudget(Number(e.target.value) || undefined)} placeholder="e.g., 50000" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Room List */}
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Project Rooms ({rooms.length})</h3>
            <div className="bg-gray-50 p-3 rounded-md border min-h-[300px] max-h-[350px] overflow-y-auto">
              {rooms.length > 0 ? (
                <div className="space-y-2">
                  {rooms.map((room, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded-md border">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{room.roomName}</p>
                        <p className="text-xs text-gray-500">{room.designTier ? `${room.designTier} Tier` : 'Placeholder'}</p>
                      </div>
                      <button type="button" onClick={() => handleRemoveRoom(index)} className="text-red-500 hover:text-red-700 font-bold p-1">&times;</button>
                    </div>
                  ))}
                </div>
              ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-500 text-center py-4">Add rooms using the panel on the right.</p>
                  </div>
              )}
            </div>
        </div>

        {/* Right Column: Compact Add Rooms Controller */}
        <div className="bg-gray-50/50 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add a Room</h3>
          
          <div className="mb-4">
            <label htmlFor="room-type-select" className="block text-sm font-medium text-gray-700 mb-1">1. Select Room Type</label>
            <select id="room-type-select" value={selectedRoomType} onChange={e => setSelectedRoomType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
              {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Choose Method</label>
            <div className="p-3 bg-white rounded-md border">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI-Powered Design</label>
              <div className="grid grid-cols-3 gap-2">
                  {DESIGN_TIER_OPTIONS.map(tier => {
                      const typedTier = tier as 'Bronze' | 'Silver' | 'Gold';
                      return (
                        <TierTooltip key={tier} tier={typedTier}>
                          <button 
                              type="button" 
                              onClick={() => handleInspireMe(typedTier)} 
                              disabled={loadingInspiration === `${selectedRoomType}-${tier}`}
                              className={`w-full text-xs font-bold py-2 px-1 rounded-md transition-colors disabled:opacity-70 disabled:cursor-wait ${TIER_BUTTON_STYLES[tier]}`}
                          >
                              {loadingInspiration === `${selectedRoomType}-${tier}` ? '...' : `✨ ${tier}`}
                          </button>
                        </TierTooltip>
                      );
                  })}
              </div>
            </div>

            <div className="p-3 mt-3 bg-white rounded-md border">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Manual Setup</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        min="1" 
                        className="w-16 p-2 border border-gray-300 rounded-md text-center"
                        aria-label={`Quantity for ${selectedRoomType}`}
                    />
                    <button 
                        type="button" 
                        onClick={handleAddPlaceholders} 
                        className="flex-1 text-sm bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-md transition-colors"
                    >
                        + Add Manually
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center">
          <button type="button" onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
            Back
          </button>
          <button 
            type="submit" 
            className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Continue to Designer
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProjectSetupScreen;