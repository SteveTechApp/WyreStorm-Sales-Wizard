
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
import { RoomData, ProjectData, IO_Device } from '../types';
import QuestionnaireForm from './QuestionnaireForm';
import { generateRoomTemplate } from '../services/geminiService';
import { ROOM_TYPES } from '../constants';

interface ProjectBuilderProps {
  onSubmit: (data: ProjectData) => void;
  onSaveProject: (data: ProjectData) => void;
  initialData: ProjectData;
}

const ProjectBuilder: React.FC<ProjectBuilderProps> = ({ onSubmit, onSaveProject, initialData }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isAddRoomMenuOpen, setIsAddRoomMenuOpen] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  useEffect(() => {
    setProjectData(initialData);
    if (initialData.rooms.length > 0 && !initialData.rooms.some(r => r.id === activeRoomId)) {
        setActiveRoomId(initialData.rooms[0].id);
    }
  }, [initialData, activeRoomId]);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectData(pd => ({ ...pd, projectName: e.target.value }));
  };

  // FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
  const handleRoomDataChange = (updatedRoomData: RoomData) => {
    setProjectData(pd => ({
        ...pd,
        rooms: pd.rooms.map(room => room.id === updatedRoomData.id ? updatedRoomData : room)
    }));
  };

  const handleSelectRoomTypeToAdd = async (roomType: string) => {
    setIsAddRoomMenuOpen(false);
    setIsAddingRoom(true);
    try {
        const templateResult = await generateRoomTemplate(roomType);
        
        // FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
        const roomsToAdd = (Array.isArray(templateResult) ? templateResult : [templateResult]).map((roomTemplate: Omit<RoomData, 'id'>) => {
            // FIX: Type error resolved by renaming FormData to RoomData. `roomTemplate` is now correctly typed.
            const { features, videoInputs, videoOutputs, audioInputs, audioOutputs, roomDimensions = { length: 20, width: 15, height: 9 }, ...rest } = roomTemplate;
            return {
                ...rest, id: uuidv4(), roomDimensions,
                features: features || [],
                videoInputs: (videoInputs || []).map((d: Omit<IO_Device, 'id'>) => ({ ...d, id: uuidv4() })),
                videoOutputs: (videoOutputs || []).map((d: Omit<IO_Device, 'id'>) => ({ ...d, id: uuidv4() })),
                audioInputs: (audioInputs || []).map((d: Omit<IO_Device, 'id'>) => ({ ...d, id: uuidv4() })),
                audioOutputs: (audioOutputs || []).map((d: Omit<IO_Device, 'id'>) => ({ ...d, id: uuidv4() })),
            };
        });
        setProjectData(pd => ({ ...pd, rooms: [...pd.rooms, ...roomsToAdd]}));
        setActiveRoomId(roomsToAdd[0].id);
    } catch (error) {
        console.error("Failed to add AI-generated room", error);
    } finally {
        setIsAddingRoom(false);
    }
  };

  const handleDuplicateRoom = () => {
    const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);
    if (!activeRoom) return;

    const newRoom = JSON.parse(JSON.stringify(activeRoom));
    newRoom.id = uuidv4();
    newRoom.roomName = `${activeRoom.roomName} (Copy)`;
    ['videoInputs', 'videoOutputs', 'audioInputs', 'audioOutputs'].forEach(key => {
        (newRoom as any)[key].forEach((item: any) => item.id = uuidv4());
    });

    setProjectData(pd => ({...pd, rooms: [...pd.rooms, newRoom]}));
    setActiveRoomId(newRoom.id);
  };

  const handleRemoveRoom = (roomId: string) => {
    if (projectData.rooms.length <= 1) return; 
    const newRooms = projectData.rooms.filter(r => r.id !== roomId);
    setProjectData(pd => ({...pd, rooms: newRooms}));
    if (activeRoomId === roomId) {
      setActiveRoomId(newRooms[0].id);
    }
  };

  const handleSave = () => {
    onSaveProject(projectData);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(projectData);
  };

  const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md animate-fade-in flex h-[calc(100vh-140px)]">
      {/* Sidebar for Room Management */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Project Rooms</h2>
        <ul className="flex-grow space-y-2 overflow-y-auto pr-2">
          {projectData.rooms.map(room => (
            <li key={room.id}>
              <button
                onClick={() => setActiveRoomId(room.id)}
                className={`w-full text-left p-2 rounded-md text-sm font-medium transition-colors flex justify-between items-center ${activeRoomId === room.id ? 'bg-[#008A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <span className="truncate">{room.roomName}</span>
                {projectData.rooms.length > 1 && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handleRemoveRoom(room.id); }}
                    className="text-xs opacity-60 hover:opacity-100 ml-2"
                    title="Remove Room"
                  >
                    &#10005;
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 relative">
            <button 
                onClick={() => setIsAddRoomMenuOpen(prev => !prev)} 
                disabled={isAddingRoom}
                className="w-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-wait"
            >
                {isAddingRoom ? 'Adding Room...' : '+ Add Room From Template'}
            </button>
             {isAddRoomMenuOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    <ul>
                        {ROOM_TYPES.map(type => (
                            <li 
                                key={type} 
                                onClick={() => handleSelectRoomTypeToAdd(type)}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                {type}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button 
                onClick={handleDuplicateRoom} 
                disabled={!activeRoom}
                className="w-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-md transition-colors disabled:opacity-50"
            >
                Duplicate Current Room
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 flex flex-col overflow-hidden">
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                 <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                      type="text"
                      id="projectName"
                      value={projectData.projectName}
                      onChange={handleProjectNameChange}
                      className="text-2xl font-bold text-[#008A3A] border-b-2 border-gray-200 focus:border-[#008A3A] outline-none bg-transparent"
                    />
                 </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={handleSave} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                        Save Project
                    </button>
                    <button type="submit" className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                        Generate Proposal
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-hidden">
              {activeRoom ? (
                  <QuestionnaireForm
                  key={activeRoom.id}
                  formData={activeRoom}
                  onChange={handleRoomDataChange}
                  />
              ) : (
                  <div className="text-center p-10 text-gray-500 flex flex-col items-center justify-center h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      <h3 className="text-lg font-semibold">Project Empty</h3>
                      <p>Use the sidebar to add your first room from an AI-powered template.</p>
                  </div>
              )}
            </div>
        </form>
      </main>
    </div>
  );
};

export default ProjectBuilder;
