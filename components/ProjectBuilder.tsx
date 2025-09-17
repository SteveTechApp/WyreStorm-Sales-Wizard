

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, RoomData, UnitSystem, RoomWizardAnswers, UserProfile, ManuallyAddedEquipment, ProjectAction } from '../utils/types';
import RoomCard from './RoomCard';
import RoomWizard from './RoomWizard';
import RoomConfigurator from './RoomConfigurator';
import { generateRoomFunctionality, getRoomEquipmentSuggestion } from '../services/roomDesignerService';
import { createDefaultRoomData } from '../utils/utils';

interface ProjectBuilderProps {
    projectData: ProjectData;
    dispatch: React.Dispatch<ProjectAction>;
    activeRoomId: string | null;
    setActiveRoomId: React.Dispatch<React.SetStateAction<string | null>>;
    onSubmit: (data: ProjectData) => void;
    onSaveProject: (data: ProjectData) => void;
    unitSystem: UnitSystem;
    onFindProduct: () => void;
    userProfile: UserProfile;
    onFindRelated: (product: ManuallyAddedEquipment) => void;
    estimatedBudget: number;
    currentHardwareCost: number;
    onOpenWallPlanner: () => void;
}

const ProjectBuilder: React.FC<ProjectBuilderProps> = ({
    projectData,
    dispatch,
    activeRoomId,
    setActiveRoomId,
    onSubmit,
    onSaveProject,
    unitSystem,
    onFindProduct,
    userProfile,
    onFindRelated,
    estimatedBudget,
    currentHardwareCost,
    onOpenWallPlanner,
}) => {
    const [isRoomWizardOpen, setIsRoomWizardOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<RoomData | null>(null);
    const [isUpdatingEquipment, setIsUpdatingEquipment] = useState(false);

    const handleUpdateRoom = (updatedRoom: RoomData) => {
        dispatch({ type: 'UPDATE_ROOM', payload: updatedRoom });
    };

    const handleAddOrUpdateRoomFromWizard = async (answers: RoomWizardAnswers) => {
        setIsRoomWizardOpen(false); 

        const { functionalityStatement } = await generateRoomFunctionality(answers) || {};
        const newRoomData = { ...answers, functionalityStatement };

        if (roomToEdit) {
            const updatedRoom = { ...roomToEdit, ...newRoomData };
            dispatch({ type: 'UPDATE_ROOM', payload: updatedRoom });
            setRoomToEdit(null);
        } else {
            const newRoom: RoomData = { ...createDefaultRoomData(), ...newRoomData, id: uuidv4() };
            dispatch({ type: 'ADD_ROOM', payload: newRoom });
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
        const newRooms = projectData.rooms.filter(r => r.id !== roomId);
        if (activeRoomId === roomId) {
            setActiveRoomId(newRooms.length > 0 ? newRooms[0].id : null);
        }
        dispatch({ type: 'REMOVE_ROOM', payload: { roomId } });
    };
    
    const handleUpdateAISuggestions = async () => {
        const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);
        if (!activeRoom) return;

        setIsUpdatingEquipment(true);
        try {
            const suggestedEquipment = await getRoomEquipmentSuggestion(activeRoom, userProfile);
            if (activeRoomId) {
                dispatch({ type: 'SET_AI_SUGGESTIONS', payload: { roomId: activeRoomId, equipment: suggestedEquipment } });
            }
        } catch (e) {
            console.error("Failed to get equipment suggestions", e);
        } finally {
            setIsUpdatingEquipment(false);
        }
    };

    const handleClearAISuggestions = () => {
        if (!activeRoomId) return;
        dispatch({ type: 'CLEAR_AI_SUGGESTIONS', payload: { roomId: activeRoomId } });
    };

    const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);
    const isConfigured = activeRoom && activeRoom.functionalityStatement;
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    };

    return (
        <div className="flex flex-col h-full bg-background-secondary rounded-lg border-2 border-border-color/50 shadow-lg animate-fade-in">
            <header className="flex-shrink-0 p-4 border-b-2 border-border-color/50 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-text-primary font-display uppercase">{projectData.projectName}</h2>
                    <p className="text-sm text-text-secondary">{projectData.clientName}</p>
                     <div className="mt-2 text-sm text-text-secondary flex items-center gap-4">
                        <span>
                            <span className="font-semibold text-text-primary">Hardware Cost: </span>
                            {formatCurrency(currentHardwareCost)}
                        </span>
                        <span>
                            <span className="font-semibold text-text-primary">Est. Budget: </span>
                             {formatCurrency(estimatedBudget)}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onSaveProject(projectData)} className="font-medium text-text-secondary hover:text-text-primary bg-background hover:bg-border-color py-2 px-4 rounded-md">
                        Save Draft
                    </button>
                    <button onClick={() => onSubmit(projectData)} className="font-bold text-text-on-accent bg-accent hover:bg-accent-hover py-2 px-5 rounded-md shadow-[0_0_15px_var(--color-accent-hover)]">
                        Generate Proposal
                    </button>
                </div>
            </header>

            <div className="flex flex-grow min-h-0">
                <aside className="w-80 flex-shrink-0 border-r-2 border-border-color/50 p-4 space-y-3 overflow-y-auto">
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
                    <button onClick={handleOpenWizardForNew} className="w-full text-center py-3 border-2 border-dashed border-border-color rounded-lg text-text-secondary hover:text-primary hover:border-primary transition-colors">
                        + Add System
                    </button>
                </aside>

                <main className="flex-grow p-4 overflow-y-auto">
                    {activeRoom ? (
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-text-primary font-display">{activeRoom.roomName}</h3>
                                    <p className="text-text-secondary mt-1 italic">
                                        {isConfigured ? activeRoom.functionalityStatement : "This system requires configuration."}
                                    </p>
                                </div>
                                {isConfigured && (
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                        <button onClick={handleClearAISuggestions} disabled={isUpdatingEquipment} className="text-sm font-medium text-text-secondary bg-background-secondary border border-border-color hover:bg-background py-1.5 px-3 rounded-md transition-colors disabled:opacity-50">
                                            Revert to Manual
                                        </button>
                                        <button onClick={handleUpdateAISuggestions} disabled={isUpdatingEquipment} className="text-sm font-medium text-text-on-accent bg-primary hover:bg-secondary py-1.5 px-3 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2">
                                            {isUpdatingEquipment ? 'Updating...' : 'Update Kit List'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {isConfigured ? (
                                <RoomConfigurator
                                    key={activeRoom.id}
                                    room={activeRoom}
                                    onUpdate={handleUpdateRoom}
                                    unitSystem={unitSystem}
                                    onFindProduct={onFindProduct}
                                    onFindRelated={onFindRelated}
                                    onOpenWallPlanner={onOpenWallPlanner}
                                />
                            ) : (
                                 <div className="text-center mt-10">
                                    <p className="text-text-secondary mb-4">Launch the AI Room Wizard to define this system's functionality.</p>
                                    <button onClick={() => handleReconfigureRoom(activeRoom)} className="bg-primary hover:bg-secondary text-text-on-accent font-bold py-2 px-6 rounded-lg">
                                        Configure System
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary">
                             <h3 className="text-xl font-semibold font-display">NO SYSTEMS IN PROJECT</h3>
                            <p className="mt-2">Click "Add System" to get started.</p>
                        </div>
                    )}
                </main>
            </div>

            <RoomWizard 
                isOpen={isRoomWizardOpen} 
                onClose={() => setIsRoomWizardOpen(false)} 
                onUpdate={handleAddOrUpdateRoomFromWizard} 
                initialData={roomToEdit} 
                unitSystem={unitSystem} 
            />
        </div>
    );
};

export default ProjectBuilder;
