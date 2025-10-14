


import React, { useState } from 'react';
// FIX: Changed import to namespace to fix "no exported member 'useNavigate'" error.
import * as ReactRouterDOM from 'react-router-dom';
import { useGenerationContext } from '../context/GenerationContext.tsx';
import { useUserContext } from '../context/UserContext.tsx';
import { ProjectSetupData, RoomData } from '../utils/types.ts';
import { PlusIcon } from '../components/Icons.tsx';
import RoomWizard from '../components/RoomWizard.tsx';
import ConfiguredRoomCard from '../components/projectSetup/ConfiguredRoomCard.tsx';
import toast from 'react-hot-toast';
import ProjectDetailsForm from '../components/projectSetup/ProjectDetailsForm.tsx';

const ProjectSetupScreen: React.FC = () => {
    const [projectName, setProjectName] = useState('New Project');
    const [clientName, setClientName] = useState('New Client');
    const [budget, setBudget] = useState<number | undefined>();
    const [timeline, setTimeline] = useState('');
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const { handleProjectSetupSubmit } = useGenerationContext();
    const { userProfile } = useUserContext();
    const navigate = ReactRouterDOM.useNavigate();

    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);

    const handleAddWithWizard = () => {
        setEditingRoom(null);
        setIsWizardOpen(true);
    };

    const handleEditWithWizard = (room: RoomData) => {
        setEditingRoom(room);
        setIsWizardOpen(true);
    };

    const handleSaveFromWizard = (savedRoom: RoomData) => {
        const existing = rooms.find(r => r.id === savedRoom.id);
        if (existing) {
            setRooms(rooms.map(r => (r.id === savedRoom.id ? savedRoom : r)));
        } else {
            setRooms([...rooms, savedRoom]);
        }
        setIsWizardOpen(false);
        setEditingRoom(null);
    };

    const handleRemoveRoom = (roomId: string) => {
        setRooms(rooms.filter(r => r.id !== roomId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rooms.length === 0) {
            toast.error("Please add at least one room to the project.");
            return;
        }
        const setupData: ProjectSetupData = { projectName, clientName, rooms, budget, timeline };
        handleProjectSetupSubmit(setupData, navigate);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-accent mb-2 uppercase tracking-widest">Plan New Project</h1>
                <p className="text-lg text-text-secondary">Define project parameters and configure rooms using the wizard.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <ProjectDetailsForm
                    projectName={projectName}
                    setProjectName={setProjectName}
                    clientName={clientName}
                    setClientName={setClientName}
                    budget={budget}
                    setBudget={setBudget}
                    timeline={timeline}
                    setTimeline={setTimeline}
                    userProfile={userProfile}
                />

                <div className="p-6 bg-background-secondary border border-border-color rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-4">// Configured Rooms</h2>
                    <div className="space-y-4">
                        {rooms.map(room => (
                           <ConfiguredRoomCard
                                key={room.id}
                                room={room}
                                onEdit={handleEditWithWizard