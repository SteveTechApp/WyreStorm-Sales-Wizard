

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// FIX: Upgraded component and corrected import paths for root file location.
import { RoomData, ProjectData, UnitSystem, DesignFeedbackItem, RoomWizardAnswers } from './types';
import QuestionnaireForm from './components/QuestionnaireForm';
import { generateRoomTemplate, reviewRoomDesign } from './services/geminiService';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from './constants';
import DesignReviewModal from './components/DesignReviewModal';

interface ProjectBuilderProps {
  onSubmit: (data: ProjectData) => void;
  onSaveProject: (data: ProjectData) => void;
  initialData: ProjectData;
  unitSystem: UnitSystem;
}

const AddRoomModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (roomType: string, designTier: string) => void;
    isAdding: boolean;
}> = ({ isOpen, onClose, onAdd, isAdding }) => {
    const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
    const [designTier, setDesignTier] = useState(DESIGN_TIER_OPTIONS[0]);

    if (!isOpen) return null;
    
    const handleAddClick = () => {
        onAdd(roomType, designTier);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Room</h2>
                <p className="text-sm text-gray-500 mb-6">Select a room type and a design tier to get an AI-generated starting point.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="roomTypeSelect" className="block text-sm font-medium text-gray-700">Room Type</label>
                        <select id="roomTypeSelect" value={roomType} onChange={e => setRoomType(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                            {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Design Tier (Inspire Me!)</label>
                        <div className="mt-2 space-y-2">
                           {DESIGN_TIER_OPTIONS.map(tier => (
                               <label key={tier} className="flex items-center p-3 border rounded-md has-[:checked]:bg-green-50 has-[:checked]:border-green-400">
                                   <input type="radio" name="designTier" value={tier} checked={designTier === tier} onChange={() => setDesignTier(tier)} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                                   <span className="ml-3 text-sm font-medium text-gray-700">{tier}</span>
                               </label>
                           ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">Cancel</button>
                    <button type="button" onClick={handleAddClick} disabled={isAdding} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400">
                        {isAdding ? 'Adding...' : 'Add Room'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProjectBuilder: React.FC<ProjectBuilderProps> = ({ onSubmit, onSaveProject, initialData, unitSystem }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [designFeedback, setDesignFeedback] = useState<DesignFeedbackItem[] | null>(null);

  useEffect(() => {
    setProjectData(initialData);
    if (initialData.rooms.length > 0 && !initialData.rooms.some(r => r.id === activeRoomId)) {
        setActiveRoomId(initialData.rooms[0].id);
    }
  }, [initialData, activeRoomId]);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectData(pd => ({ ...pd, projectName: e.target.value }));
  };

  const handleRoomDataChange = (updatedRoomData: RoomData) => {
    setProjectData(pd => ({
        ...pd,
        rooms: pd.rooms.map(room => room.id === updatedRoomData.id ? updatedRoomData : room)
    }));
  };

  const handleSelectRoomTypeToAdd = async (roomType: string, designTier: string) => {
    setIsAddingRoom(true);
    try {
        // FIX: Added a default wizardAnswers object to satisfy the function signature.
        const defaultWizardAnswers: RoomWizardAnswers = {
            roomName: `${designTier} ${roomType}`,
            participantCount: 10,
            primaryUse: 'General Presentation',
            displayConfiguration: [{ type: 'display', quantity: 1 }],
            features: ['Video Conferencing', 'Wireless Presentation'],
        };
        const templateResult = await generateRoomTemplate(roomType, designTier, defaultWizardAnswers);
        
        const newRoom: RoomData = { ...templateResult, id: uuidv4() };
        
        // Ensure name is unique
        let counter = 1;
        let potentialName = newRoom.roomName;
        while (projectData.rooms.some(r => r.roomName === potentialName)) {
            counter++;
            potentialName = `${newRoom.roomName.replace(/ \d+$/, '')} ${counter}`;
        }
        newRoom.roomName = potentialName;

        setProjectData(pd => ({ ...pd, rooms: [...pd.rooms, newRoom]}));
        setActiveRoomId(newRoom.id);
        setIsAddRoomModalOpen(false);
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
  
  const handleReviewDesign = async () => {
    const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);
    if (!activeRoom) return;

    setIsReviewing(true);
    setDesignFeedback(null);
    setIsReviewModalOpen(true);

    try {
        const feedback = await reviewRoomDesign(activeRoom);
        setDesignFeedback(feedback);
    } catch (error) {
        console.error("Failed to get design review:", error);
        setDesignFeedback([{ type: 'Warning', text: 'Could not get design review from the AI.' }]);
    } finally {
        setIsReviewing(false);
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
    <>
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
                  onClick={() => setIsAddRoomModalOpen(true)}
                  className="w-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-md transition-colors"
              >
                  + Add Room
              </button>
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
                      <button type="button" onClick={handleReviewDesign} disabled={!activeRoom || isReviewing} className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          Review Design
                      </button>
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
                    unitSystem={unitSystem}
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
      <AddRoomModal 
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAdd={handleSelectRoomTypeToAdd}
        isAdding={isAddingRoom}
      />
      <DesignReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        feedback={designFeedback}
        isLoading={isReviewing}
      />
    </>
  );
};

export default ProjectBuilder;