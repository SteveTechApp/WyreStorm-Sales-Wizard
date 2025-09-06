import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from '../types';
import RoomWizard from './RoomWizard';

interface ProjectSetupScreenProps {
  onSubmit: (data: { 
    projectName: string; 
    clientName: string; 
    coverImage: string; 
    rooms: { roomType: string; designTier: string }[] 
  }) => void;
  onBack: () => void;
  defaultProjectName: string;
  userProfile: UserProfile | null;
}

interface RoomInstance {
    id: string;
    name: string;
    roomType: string;
    designTier: string;
}

const ProjectSetupScreen: React.FC<ProjectSetupScreenProps> = ({ onSubmit, onBack, defaultProjectName, userProfile }) => {
  const [projectName, setProjectName] = useState(defaultProjectName);
  const [clientName, setClientName] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [rooms, setRooms] = useState<RoomInstance[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleAddRoom = (name: string, roomType: string, designTier: string) => {
    const newRoom: RoomInstance = {
      id: uuidv4(),
      name,
      roomType,
      designTier
    };
    setRooms(prev => [...prev, newRoom]);
    setIsWizardOpen(false);
  };
  
  const handleRemoveRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rooms.length === 0) return;
    // We only need roomType and designTier for the next step
    const roomsToSubmit = rooms.map(({ roomType, designTier }) => ({ roomType, designTier }));
    onSubmit({ projectName, clientName, coverImage, rooms: roomsToSubmit });
  };
  
  const TIER_BADGE_STYLES: Record<string, string> = {
      'Bronze': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Silver': 'bg-gray-200 text-gray-800 border-gray-300',
      'Gold': 'bg-amber-100 text-amber-800 border-amber-300',
  };

  return (
    <>
      <RoomWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onAdd={handleAddRoom}
      />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#008A3A] mb-2">Build Your Project</h2>
        <p className="text-gray-600 mb-6">Define the project details and add bespoke rooms using the AI-powered Room Wizard.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Client Name (Optional)</label>
            <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        
         <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (Optional)</label>
          <div className="mt-1 flex items-center gap-4">
              <div className="w-24 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border">
              {coverImage ? <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Preview</span>}
              </div>
              <label htmlFor="cover-image-upload" className="cursor-pointer text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-md">
              Upload Image
              <input id="cover-image-upload" type="file" onChange={handleCoverImageChange} accept="image/*" className="hidden" />
              </label>
          </div>
        </div>

        <div className="bg-gray-50/50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Project Room List</h3>
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="bg-[#008A3A] hover:bg-[#00732f] text-white text-sm font-bold py-2 px-4 rounded-md transition-colors"
            >
              + Add Room
            </button>
          </div>
          <div className="min-h-[120px]">
            {rooms.length > 0 ? (
              <ul className="space-y-2">
                {rooms.map((room) => (
                  <li key={room.id} className="flex items-center justify-between text-sm bg-white p-3 rounded border animate-fade-in-fast">
                    <div>
                      <span className="font-semibold text-gray-800">{room.name}</span>
                      <span className="text-gray-500 ml-2">({room.roomType})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-xs px-2 py-1 rounded-full border ${TIER_BADGE_STYLES[room.designTier]}`}>{room.designTier}</span>
                      <button type="button" onClick={() => handleRemoveRoom(room.id)} className="text-red-500 hover:text-red-700 text-xs ml-2 p-1 font-bold" title="Remove Room">&#10005;</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Your project is empty.</p>
                <p>Click "Add Room" to get started.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button type="button" onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
            Back to Home
          </button>
          <button 
            type="submit" 
            disabled={rooms.length === 0}
            className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Project
          </button>
        </div>
      </form>
    </>
  );
};

export default ProjectSetupScreen;