

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// FIX: Corrected import for ProjectSetupData. It should be imported from '../types' not '../App'.
import { ProjectSetupData, UserProfile, RoomData } from '../types';
import { ROOM_TYPES } from '../constants';
import { TrashIcon } from './Icons';

interface RoomPlaceholder {
    id: string;
    roomName: string;
    roomType: string;
}

interface ProjectSetupScreenProps {
    onSubmit: (data: ProjectSetupData) => void;
    onBack: () => void;
    defaultProjectName: string;
    userProfile: UserProfile | null;
}

const ProjectSetupScreen: React.FC<ProjectSetupScreenProps> = ({ onSubmit, onBack, defaultProjectName, userProfile }) => {
    const [projectName, setProjectName] = useState(defaultProjectName);
    const [clientName, setClientName] = useState('');
    const [clientContactName, setClientContactName] = useState('');
    const [clientContactEmail, setClientContactEmail] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [projectBudget, setProjectBudget] = useState<number | undefined>(undefined);
    const [rooms, setRooms] = useState<RoomPlaceholder[]>([]);

    const handleAddRoom = () => {
        setRooms([...rooms, { id: uuidv4(), roomName: `Room ${rooms.length + 1}`, roomType: ROOM_TYPES[0] }]);
    };

    const handleRoomChange = (id: string, field: 'roomName' | 'roomType', value: string) => {
        setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleRemoveRoom = (id: string) => {
        setRooms(rooms.filter(r => r.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const setupData: ProjectSetupData = {
            projectName,
            clientName,
            clientContactName,
            clientContactEmail,
            clientAddress,
            projectBudget,
            coverImage: '', // Placeholder for now
            rooms: rooms.map(({ id, ...rest }) => ({
                ...rest,
                // These are defaults for an unconfigured room
                designTier: 'Silver',
                maxParticipants: 10,
                primaryUse: 'General Presentation',
                features: [],
                functionalityStatement: '',
            }))
        };
        onSubmit(setupData);
    };

    return (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-[#008A3A] mb-2">Create New Project</h2>
            <p className="text-gray-600 mb-6">Enter the basic details for your project. You'll configure each room in the next step.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project & Client Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Company Name</label>
                        <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                     <div>
                        <label htmlFor="clientContactName" className="block text-sm font-medium text-gray-700">Client Contact Name</label>
                        <input type="text" id="clientContactName" value={clientContactName} onChange={e => setClientContactName(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="clientContactEmail" className="block text-sm font-medium text-gray-700">Client Contact Email</label>
                        <input type="email" id="clientContactEmail" value={clientContactEmail} onChange={e => setClientContactEmail(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Project Address</label>
                        <input type="text" id="clientAddress" value={clientAddress} onChange={e => setClientAddress(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>

                {/* Rooms Section */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Rooms</h3>
                    <div className="mt-2 space-y-3 p-4 bg-gray-50 border rounded-md">
                        {rooms.map((room) => (
                            <div key={room.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                                <input
                                    type="text"
                                    value={room.roomName}
                                    onChange={e => handleRoomChange(room.id, 'roomName', e.target.value)}
                                    className="md:col-span-3 p-2 border border-gray-300 rounded-md"
                                    placeholder="Room Name"
                                />
                                <select
                                    value={room.roomType}
                                    onChange={e => handleRoomChange(room.id, 'roomType', e.target.value)}
                                    className="md:col-span-2 p-2 border border-gray-300 rounded-md"
                                >
                                    {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                                <button type="button" onClick={() => handleRemoveRoom(room.id)} className="text-red-500 hover:text-red-700 justify-self-end p-2">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddRoom} className="w-full text-center text-sm mt-2 py-2 border-2 border-dashed rounded-lg text-gray-500 hover:text-green-600 hover:border-green-400 transition-colors">
                            + Add Another Room
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <button type="button" onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">
                        Back
                    </button>
                    <button type="submit" className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-6 rounded-lg">
                        Start Designing
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectSetupScreen;