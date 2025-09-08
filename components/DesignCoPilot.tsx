
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, RoomData, UserProfile, DesignFeedbackItem, Currency, RoomWizardAnswers } from '../types';
import { getProjectInsights, generateRoomTemplate } from '../services/geminiService';
import { CURRENCY_OPTIONS } from '../constants';
import AIInsightsPanel from './AIInsightsPanel';
import RoomWizard from './RoomWizard';
import QuestionnaireForm from './QuestionnaireForm';
import RoomCard from './RoomCard';

interface DesignCoPilotProps {
  initialData: ProjectData;
  onSubmit: (data: ProjectData) => void;
  onSaveProject: (data: ProjectData) => void;
  userProfile: UserProfile;
}

const TIER_COST_ESTIMATES: Record<string, number> = {
  'Bronze': 3500,
  'Silver': 8000,
  'Gold': 15000,
};

const DesignCoPilot: React.FC<DesignCoPilotProps> = ({ initialData, onSubmit, onSaveProject, userProfile }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [insights, setInsights] = useState<DesignFeedbackItem[]>([]);
  const [isGettingInsights, setIsGettingInsights] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [configuringRoom, setConfiguringRoom] = useState<RoomData | null>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'details'>('canvas');
  const [activeRoomIdForDetails, setActiveRoomIdForDetails] = useState<string | null>(initialData.rooms[0]?.id || null);

  const currencySymbol = useMemo(() => CURRENCY_OPTIONS[userProfile.currency as Currency]?.symbol || '$', [userProfile.currency]);

  const estimatedHardwareCost = useMemo(() => {
    return projectData.rooms.reduce((total, room) => {
      if (room.designTier) {
        return total + (TIER_COST_ESTIMATES[room.designTier] || 0);
      }
      return total;
    }, 0);
  }, [projectData.rooms]);

  const updateProjectData = (data: ProjectData) => {
    setProjectData(data);
    refreshInsights(data);
  };
  
  const refreshInsights = useCallback(async (data: ProjectData) => {
    if (data.rooms.length === 0) {
        setInsights([]);
        return;
    };
    setIsGettingInsights(true);
    try {
      const newInsights = await getProjectInsights(data);
      setInsights(newInsights);
    } catch (error) {
      console.error("Failed to get project insights:", error);
    } finally {
      setIsGettingInsights(false);
    }
  }, []);
  
  useEffect(() => {
    refreshInsights(projectData);
  }, []);

  const handleProjectChange = (field: keyof ProjectData, value: any) => {
    const newData = { ...projectData, [field]: value };
    updateProjectData(newData);
  };
  
  const handleStartRoomConfiguration = (room: RoomData) => {
    setConfiguringRoom(room);
    setIsWizardOpen(true);
  };
  
  const handleStartAddRoom = () => {
    setConfiguringRoom(null); // Explicitly set to null for "add" mode
    setIsWizardOpen(true);
  };

  const handleRoomConfigurationComplete = async (answers: RoomWizardAnswers, roomType: string, designTier: string) => {
    setIsWizardOpen(false); // Close modal immediately

    try {
        const template = await generateRoomTemplate(roomType, designTier, answers);

        if (configuringRoom) {
            // --- UPDATE EXISTING ROOM ---
            const updatedRoom = { 
                ...template, 
                id: configuringRoom.id, 
                roomName: configuringRoom.roomName,
            };
            const newData = { ...projectData, rooms: projectData.rooms.map(r => r.id === configuringRoom.id ? updatedRoom : r) };
            updateProjectData(newData);
        } else {
            // --- ADD NEW ROOM ---
            let potentialName = template.roomName;
            if (!potentialName.trim()) {
                potentialName = `New ${roomType}`;
            }
            const baseName = potentialName.trim();
            let counter = 1;
            while (projectData.rooms.some(r => r.roomName === potentialName)) {
                counter++;
                potentialName = `${baseName} (${counter})`;
            }
            template.roomName = potentialName;

            const newRoom: RoomData = { ...template, id: uuidv4() };
            const newData = { ...projectData, rooms: [...projectData.rooms, newRoom] };
            
            updateProjectData(newData);
            // After adding, select the new room and switch to details view
            setActiveRoomIdForDetails(newRoom.id);
            setActiveTab('details');
        }
    } catch (error) {
        console.error("Failed to process room configuration from wizard", error);
    } finally {
        setConfiguringRoom(null);
    }
  };


  const handleUpdateRoom = (updatedRoom: RoomData) => {
     const newData = { ...projectData, rooms: projectData.rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r) };
     updateProjectData(newData);
  };
  
  const handleRemoveRoom = (roomId: string) => {
    const newData = { ...projectData, rooms: projectData.rooms.filter(r => r.id !== roomId) };
    if (activeRoomIdForDetails === roomId) {
        setActiveRoomIdForDetails(newData.rooms[0]?.id || null);
    }
    updateProjectData(newData);
  };

  const activeRoomForDetails = useMemo(() => projectData.rooms.find(r => r.id === activeRoomIdForDetails), [projectData.rooms, activeRoomIdForDetails]);

  return (
    <>
      <div className="w-full h-[calc(100vh-120px)] bg-white rounded-lg border shadow-md flex animate-fade-in">
        {/* Left Panel: Dashboard & Project Info */}
        <div className="w-80 border-r p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Project Dashboard</h2>
            <input type="text" value={projectData.projectName} onChange={e => handleProjectChange('projectName', e.target.value)} className="w-full p-2 border rounded font-semibold"/>
            <div>
                <label className="text-sm font-medium text-gray-600">Total Project Budget ({currencySymbol})</label>
                <input type="number" placeholder="Enter budget..." value={projectData.projectBudget || ''} onChange={e => handleProjectChange('projectBudget', Number(e.target.value))} className="w-full p-2 border rounded mt-1"/>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-600">Approx. Hardware Cost (WyreStorm only)</label>
                <div className="w-full p-2 border rounded mt-1 bg-gray-100 font-semibold text-gray-800">
                    {`${currencySymbol}${estimatedHardwareCost.toLocaleString()}`}
                </div>
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Rooms ({projectData.rooms.length})</h3>
                    <button onClick={handleStartAddRoom} className="text-sm font-medium text-[#008A3A] hover:underline">+ Add Room</button>
                </div>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-2">
                    {projectData.rooms.map(room => (
                        <div 
                            key={room.id} 
                            onClick={() => { setActiveRoomIdForDetails(room.id); setActiveTab('details'); }} 
                            className={`p-2 rounded border cursor-pointer transition-colors ${
                                activeRoomIdForDetails === room.id 
                                ? 'bg-green-100 border-green-400 font-medium' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                            <p className="text-sm truncate">{room.roomName}</p>
                            <p className="text-xs text-gray-500">{room.roomType} - {room.designTier || 'Not Configured'}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0 space-y-2">
                 <button onClick={() => onSaveProject(projectData)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">Save Project</button>
                <button onClick={() => onSubmit(projectData)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md">Generate Final Proposal</button>
            </div>
        </div>

        {/* Center Panel: Main View */}
        <div className="flex-1 flex flex-col">
            <div className="border-b p-2">
                <button onClick={() => setActiveTab('canvas')} className={`px-4 py-2 text-sm font-medium rounded ${activeTab === 'canvas' ? 'bg-gray-200 text-gray-800' : 'text-gray-500'}`}>Project Canvas</button>
                <button onClick={() => setActiveTab('details')} disabled={!activeRoomForDetails} className={`px-4 py-2 text-sm font-medium rounded ${activeTab === 'details' ? 'bg-gray-200 text-gray-800' : 'text-gray-500'} disabled:opacity-50`}>Room Details</button>
            </div>
            <div className="flex-grow bg-gray-50/50 p-4 overflow-auto">
                {activeTab === 'canvas' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projectData.rooms.map(room => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                isActive={activeRoomIdForDetails === room.id}
                                onSelect={() => {
                                    setActiveRoomIdForDetails(room.id);
                                    setActiveTab('details');
                                }}
                                onReconfigure={() => handleStartRoomConfiguration(room)}
                                onRemove={() => handleRemoveRoom(room.id)}
                            />
                        ))}
                    </div>
                )}
                 {activeTab === 'details' && activeRoomForDetails && (
                    <QuestionnaireForm key={activeRoomForDetails.id} formData={activeRoomForDetails} onChange={handleUpdateRoom} unitSystem={userProfile.unitSystem} />
                 )}
                 {activeTab === 'details' && !activeRoomForDetails && (
                    <div className="text-center text-gray-500 pt-20">Select a room from the dashboard to see its details.</div>
                 )}
            </div>
        </div>

        {/* Right Panel: AI Insights */}
        <AIInsightsPanel insights={insights} isLoading={isGettingInsights} onRefresh={() => refreshInsights(projectData)} />
      </div>
      
      <RoomWizard
        isOpen={isWizardOpen}
        onClose={() => { setIsWizardOpen(false); setConfiguringRoom(null); }}
        onAdd={handleRoomConfigurationComplete}
        initialData={configuringRoom}
      />
    </>
  );
};

export default DesignCoPilot;
