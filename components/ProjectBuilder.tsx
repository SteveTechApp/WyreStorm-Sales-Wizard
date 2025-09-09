
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, RoomData, UnitSystem, RoomWizardAnswers } from '../types';
import RoomCard from './RoomCard';
import RoomWizard from './RoomWizard';
import QuestionnaireForm from './QuestionnaireForm';
import Tabs from './Tabs';
import { generateRoomFunctionality } from '../services/geminiService';

interface ProjectBuilderProps {
    projectData: ProjectData;
    setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
    activeRoomId: string | null;
    setActiveRoomId: React.Dispatch<React.SetStateAction<string | null>>;
    onSubmit: (data: ProjectData) => void;
    onSaveProject: (data: ProjectData) => void;
    unitSystem: UnitSystem;
}

const ProjectBuilder: React.FC<ProjectBuilderProps> = ({
    projectData,
    setProjectData,
    activeRoomId,
    setActiveRoomId,
    onSubmit,
    onSaveProject,
    unitSystem,
}) => {
    const [isRoomWizardOpen, setIsRoomWizardOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<RoomData | null>(null);

    const handleUpdateRoom = (updatedRoom: RoomData) => {
        setProjectData(prevData => ({
            ...prevData,
            rooms: prevData.rooms.map(r => (r.id === updatedRoom.id ? updatedRoom : r)),
        }));
    };

    const handleAddOrUpdateRoomFromWizard = async (answers: RoomWizardAnswers, roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold') => {
        setIsRoomWizardOpen(false);

        // Call Gemini to get the functionality statement
        const { functionalityStatement, features: refinedFeatures } = await generateRoomFunctionality(answers, roomType, designTier);

        const newRoomData = {
            ...answers,
            roomType,
            designTier,
            functionalityStatement,
            features: refinedFeatures,
            maxParticipants: answers.participantCount,
        };

        if (roomToEdit) {
            // Update existing room
            const updatedRoom = { ...roomToEdit, ...newRoomData };
            handleUpdateRoom(updatedRoom);
            setRoomToEdit(null);
        } else {
            // Add new room
            const newRoom: RoomData = {
                ...newRoomData,
                id: uuidv4(),
            };
            setProjectData(prevData => ({
                ...prevData,
                rooms: [...prevData.rooms, newRoom],
            }));
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
            const newRooms = prevData.rooms.filter(r => r.id !== roomId);
            // If the active room was deleted, select the first one or null
            if (activeRoomId === roomId) {
                setActiveRoomId(newRooms.length > 0 ? newRooms[0].id : null);
            }
            return { ...prevData, rooms: newRooms };
        });
    };

    const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);
    
    const isConfigured = activeRoom && activeRoom.functionalityStatement;

    const renderTabs = () => {
        if (!activeRoom) return null;
        
        const tabs = [
            {
                label: 'Configuration',
                content: <QuestionnaireForm room={activeRoom} onUpdate={handleUpdateRoom} unitSystem={unitSystem} />,
            }
        ];

        return <Tabs tabs={tabs} />;
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-lg animate-fade-in">
            <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{projectData.projectName}</h2>
                    <p className="text-sm text-gray-500">{projectData.clientName}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onSaveProject(projectData)} className="font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md">
                        Save Project
                    </button>
                    <button onClick={() => onSubmit(projectData)} className="font-bold text-white bg-[#008A3A] hover:bg-[#00732f] py-2 px-5 rounded-md">
                        Generate Proposal
                    </button>
                </div>
            </header>

            <div className="flex flex-grow min-h-0">
                <aside className="w-80 flex-shrink-0 border-r p-4 space-y-3 overflow-y-auto">
                    {projectData.rooms.map(room => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            isActive={room.id === activeRoomId}
                            onSelect={() => setActiveRoomId(room.id)}
                            onReconfigure={() => handleReconfigureRoom(room)}
                            onRemove={() => handleRemoveRoom(room.id)}
                        />
                    ))}
                    <button onClick={handleOpenWizardForNew} className="w-full text-center py-3 border-2 border-dashed rounded-lg text-gray-500 hover:text-green-600 hover:border-green-400 transition-colors">
                        + Add Room
                    </button>
                </aside>

                <main className="flex-grow p-4 overflow-y-auto">
                    {activeRoom ? (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{activeRoom.roomName}</h3>
                            <p className="text-gray-600 mt-1 mb-4 italic">{isConfigured ? activeRoom.functionalityStatement : "This room needs to be configured."}</p>
                            {isConfigured ? renderTabs() : (
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

            <RoomWizard
                isOpen={isRoomWizardOpen}
                onClose={() => setIsRoomWizardOpen(false)}
                onAdd={handleAddOrUpdateRoomFromWizard}
                initialData={roomToEdit}
            />
        </div>
    );
};

export default ProjectBuilder;
