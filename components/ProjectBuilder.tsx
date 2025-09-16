import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, RoomData, UnitSystem, RoomWizardAnswers, UserProfile, ManuallyAddedEquipment } from '../utils/types';
import RoomCard from './RoomCard';
import RoomWizard from './RoomWizard';
import RoomConfigurator from './RoomConfigurator';
import { generateRoomFunctionality, getRoomEquipmentSuggestion } from '../services/geminiService';
import { createDefaultRoomData } from '../utils/utils';

interface ProjectBuilderProps {
    projectData: ProjectData;
    setProjectData: React.Dispatch<React.SetStateAction<ProjectData | null>>;
    activeRoomId: string | null;
    setActiveRoomId: React.Dispatch<React.SetStateAction<string | null>>;
    onSubmit: (data: ProjectData) => void;
    onSaveProject: (data: ProjectData) => void;
    unitSystem: UnitSystem;
    onFindProduct: () => void;
    userProfile: UserProfile;
    onFindRelated: (product: ManuallyAddedEquipment) => void;
}

const ProjectBuilder: React.FC<ProjectBuilderProps> = ({
    projectData,
    setProjectData,
    activeRoomId,
    setActiveRoomId,
    onSubmit,
    onSaveProject,
    unitSystem,
    onFindProduct,
    userProfile,
    onFindRelated
}) => {
    const [isRoomWizardOpen, setIsRoomWizardOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<RoomData | null>(null);
    const [isUpdatingEquipment, setIsUpdatingEquipment] = useState(false);

    const handleUpdateRoom = (updatedRoom: RoomData) => {
        setProjectData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                rooms: prevData.rooms.map(r => (r.id === updatedRoom.id ? updatedRoom : r)),
            }
        });
    };

    const handleAddOrUpdateRoomFromWizard = async (answers: RoomWizardAnswers) => {
        setIsRoomWizardOpen(false);
        const { functionalityStatement } = await generateRoomFunctionality(answers) || {};
        const newRoomData = { ...answers, functionalityStatement };

        if (roomToEdit) {
            const updatedRoom = { ...roomToEdit, ...newRoomData };
            handleUpdateRoom(updatedRoom);
            setRoomToEdit(null);
        } else {
            const newRoom: RoomData = { ...createDefaultRoomData(), ...newRoomData, id: uuidv4() };
            setProjectData(prevData => {
                 if (!prevData) return null;
                return { ...prevData, rooms: [...prevData.rooms, newRoom] }
            });
            setActiveRoomId(newRoom.id);
        }
    };

    const handleOpenWizardForNew = () => {
        setRoomToEdit(null);
        setIsRoomWizardOpen(true);
    };

    const handleReconfigureRoom = (room: RoomData) => {
        setRoomToEdit(room);
        setIsRoomWizardOpen(true);
    };

    const handleRemoveRoom = (roomId: string) => {
        setProjectData(prevData => {
            if (!prevData) return null;
            const newRooms = prevData.rooms.filter(r => r.id !== roomId);
            if (activeRoomId === roomId) {
                setActiveRoomId(newRooms.length > 0 ? newRooms[0].id : null);
            }
            return { ...prevData, rooms: newRooms };
        });
    };
    
    const handleUpdateAISuggestions = async () => {
        const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);
        if (!activeRoom) return;
        setIsUpdatingEquipment(true);
        try {
            const suggestedEquipment = await getRoomEquipmentSuggestion(activeRoom, userProfile);
            setProjectData(prevData => {
                if (!prevData) return null;
                const updatedRooms = prevData.rooms.map(room => {
                    if (room.id === activeRoomId) {
                        const userAddedEquipment = room.manuallyAddedEquipment.filter(item => !item.isAiGenerated);
                        return { ...room, manuallyAddedEquipment: [...userAddedEquipment, ...suggestedEquipment] };
                    }
                    return room;
                });
                return { ...prevData, rooms: updatedRooms };
            });
        } catch (e) {
            console.error("Failed to get equipment suggestions", e);
            // In a real app, you might want to show a user-facing error here.
        } finally {
            setIsUpdatingEquipment(false);
        }
    };

    const handleClearAISuggestions = () => {
        if (!activeRoomId) return;
        setProjectData(prevData => {
            if (!prevData) return null;
            const updatedRooms = prevData.rooms.map(room => {
                if (room.id === activeRoomId) {
                    const userAddedEquipment = room.manuallyAddedEquipment.filter(item => !item.isAiGenerated);
                    return { ...room, manuallyAddedEquipment: userAddedEquipment };
                }
                return room;
            });
            return { ...prevData, rooms: updatedRooms };
        });
    };


    const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);
    const isConfigured = activeRoom && activeRoom.functionalityStatement;

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-lg animate-fade-in">
            <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{projectData.projectName}</h2>
                    <p className="text-sm text-gray-500">{projectData.clientName}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onSaveProject(projectData)} className="font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md">
                        Save Draft
                    </button>
                    <button onClick={() => onSubmit(projectData)} className="font-bold text-white bg-[#008A3A] hover:bg-[#00732f] py-2 px-5 rounded-md">
                        Generate Proposal
                    </button>
                </div>
            </header>

            <div className="flex flex-grow min-h-0">
                <aside className="w-80 flex-shrink-0 border-r p-4 space-y-3 overflow-y-auto">
                    {projectData.rooms.map(room => (
                        <RoomCard key={room.id} room={room} isActive={room.id === activeRoomId} onSelect={() => setActiveRoomId(room.id)} onReconfigure={() => handleReconfigureRoom(room)} onRemove={() => handleRemoveRoom(room.id)} />
                    ))}
                    <button onClick={handleOpenWizardForNew} className="w-full text-center py-3 border-2 border-dashed rounded-lg text-gray-500 hover:text-green-600 hover:border-green-400 transition-colors">
                        + Add Room
                    </button>
                </aside>

                <main className="flex-grow p-4 overflow-y-auto">
                    {activeRoom ? (
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{activeRoom.roomName}</h3>
                                    <p className="text-gray-600 mt-1 italic">{isConfigured ? activeRoom.functionalityStatement : "This room needs to be configured."}</p>
                                </div>
                                {isConfigured && (
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                        <button onClick={handleClearAISuggestions} disabled={isUpdatingEquipment} className="text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 py-1.5 px-3 rounded-md transition-colors disabled:opacity-50">
                                            Revert to Default Spec
                                        </button>
                                        <button onClick={handleUpdateAISuggestions} disabled={isUpdatingEquipment} className="text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 py-1.5 px-3 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2">
                                            {isUpdatingEquipment ? (
                                                <><svg className="animate-spin h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Updating...</>
                                            ) : 'Update Kit List'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {isConfigured ? (
                                <RoomConfigurator
                                    key={activeRoom.id} // Add key to force re-mount on room change
                                    room={activeRoom}
                                    onUpdate={handleUpdateRoom}
                                    unitSystem={unitSystem}
                                    onFindProduct={onFindProduct}
                                    onFindRelated={onFindRelated}
                                />
                            ) : (
                                 <div className="text-center mt-10">
                                    <p className="text-gray-500 mb-4">Launch the AI Room Wizard to define this room's functionality.</p>
                                    <button onClick={() => handleReconfigureRoom(activeRoom)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                                        Configure Room
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                             <h3 className="text-xl font-semibold">No Rooms in Project</h3>
                            <p className="mt-2">Click "Add Room" to get started.</p>
                        </div>
                    )}
                </main>
            </div>

            <RoomWizard isOpen={isRoomWizardOpen} onClose={() => setIsRoomWizardOpen(false)} onUpdate={handleAddOrUpdateRoomFromWizard} initialData={roomToEdit} unitSystem={unitSystem} />
        </div>
    );
};

export default ProjectBuilder;