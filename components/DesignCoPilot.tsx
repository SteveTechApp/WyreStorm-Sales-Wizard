
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, RoomData, UserProfile, DesignFeedbackItem, TieredRoomResponse, Currency } from '../types';
import { getProjectInsights } from '../services/geminiService';
import { CURRENCY_OPTIONS, ROOM_TYPES } from '../constants';
import AIInsightsPanel from './AIInsightsPanel';
import RoomConfiguratorModal from './RoomConfiguratorModal';
import QuestionnaireForm from './QuestionnaireForm';

interface DesignCoPilotProps {
  initialData: ProjectData;
  onSubmit: (data: ProjectData) => void;
  onSaveProject: (data: ProjectData) => void;
  userProfile: UserProfile;
}

const TIER_STYLES: Record<string, { bg: string; text: string; border: string; }> = {
    'Bronze': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' },
    'Silver': { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-400' },
    'Gold': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-400' },
};

const DesignCoPilot: React.FC<DesignCoPilotProps> = ({ initialData, onSubmit, onSaveProject, userProfile }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [insights, setInsights] = useState<DesignFeedbackItem[]>([]);
  const [isGettingInsights, setIsGettingInsights] = useState(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'details'>('canvas');
  const [activeRoomIdForDetails, setActiveRoomIdForDetails] = useState<string | null>(initialData.rooms[0]?.id || null);

  const currencySymbol = useMemo(() => CURRENCY_OPTIONS[userProfile.currency as Currency]?.symbol || '$', [userProfile.currency]);

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
  
  const handleAddRoom = (roomData: Omit<RoomData, 'id'>) => {
    const newRoom = { ...roomData, id: uuidv4() };
    const newData = { ...projectData, rooms: [...projectData.rooms, newRoom] };
    updateProjectData(newData);
    setActiveRoomIdForDetails(newRoom.id);
    setActiveTab('details');
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
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-700">Rooms</h3>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {projectData.rooms.map(room => (
                        <div key={room.id} onClick={() => { setActiveRoomIdForDetails(room.id); setActiveTab('details'); }} className={`p-2 rounded border cursor-pointer ${activeRoomIdForDetails === room.id && activeTab === 'details' ? 'bg-green-100 border-green-400' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            <p className="font-medium text-sm truncate">{room.roomName}</p>
                            <p className="text-xs text-gray-500">{room.roomType} - {room.designTier}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0 space-y-2">
                <button onClick={() => setIsConfiguratorOpen(true)} className="w-full bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">+ Add New Room</button>
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
                            <div key={room.id} className="bg-white p-4 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-800">{room.roomName}</p>
                                        <p className="text-sm text-gray-500">{room.roomType}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${TIER_STYLES[room.designTier || 'Silver']?.bg} ${TIER_STYLES[room.designTier || 'Silver']?.text} ${TIER_STYLES[room.designTier || 'Silver']?.border}`}>{room.designTier}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-2 italic">{room.functionalityStatement}</p>
                                <div className="mt-3 pt-3 border-t flex justify-between">
                                    <button onClick={() => { setEditingRoomId(room.id); setIsConfiguratorOpen(true); }} className="text-xs font-semibold text-blue-600 hover:underline">Configure</button>
                                    <button onClick={() => handleRemoveRoom(room.id)} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
                                </div>
                            </div>
                        ))}
                         <button onClick={() => setIsConfiguratorOpen(true)} className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed hover:bg-gray-100 text-gray-500">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                           Add Room
                        </button>
                    </div>
                )}
                 {activeTab === 'details' && activeRoomForDetails && (
                    <QuestionnaireForm key={activeRoomForDetails.id} formData={activeRoomForDetails} onChange={handleUpdateRoom} unitSystem={userProfile.unitSystem} />
                 )}
                 {activeTab === 'details' && !activeRoomForDetails && (
                    <div className="text-center text-gray-500 pt-20">Select a room from the dashboard or add one to see its details.</div>
                 )}
            </div>
        </div>

        {/* Right Panel: AI Insights */}
        <AIInsightsPanel insights={insights} isLoading={isGettingInsights} onRefresh={() => refreshInsights(projectData)} />
      </div>

      <RoomConfiguratorModal 
        isOpen={isConfiguratorOpen}
        onClose={() => { setIsConfiguratorOpen(false); setEditingRoomId(null); }}
        onRoomConfigured={(roomData) => {
            if(editingRoomId) {
                handleUpdateRoom({ ...roomData, id: editingRoomId });
            } else {
                handleAddRoom(roomData);
            }
        }}
        existingRoom={projectData.rooms.find(r => r.id === editingRoomId)}
      />
    </>
  );
};

export default DesignCoPilot;
