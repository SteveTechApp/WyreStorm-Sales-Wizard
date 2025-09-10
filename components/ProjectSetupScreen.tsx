import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectSetupData, UserProfile } from '../types';
import { ROOM_TYPES } from '../constants';
import { TrashIcon } from './Icons';
import { createDefaultRoomData } from '../utils';

interface RoomPlaceholder {
    id: string;
    roomName: string;
    roomType: string;
}

// Interface for the form's state object
interface ProjectSetupFormData {
    projectName: string;
    clientName: string;
    clientContactName: string;
    clientContactEmail: string;
    clientAddress: string;
    projectBudget: number | undefined;
    rooms: RoomPlaceholder[];
}

interface ProjectSetupScreenProps {
    onSubmit: (data: ProjectSetupData) => void;
    onBack: () => void;
    defaultProjectName: string;
    userProfile: UserProfile | null;
}

const ProjectSetupScreen: React.FC<ProjectSetupScreenProps> = ({ onSubmit, onBack, defaultProjectName, userProfile }) => {
    // Use a single state object for the form data
    const [formData, setFormData] = useState<ProjectSetupFormData>({
        projectName: defaultProjectName,
        clientName: '',
        clientContactName: '',
        clientContactEmail: '',
        clientAddress: '',
        projectBudget: undefined,
        rooms: [],
    });

    // Load draft from localStorage on initial render
    useEffect(() => {
        try {
            const savedDraft = localStorage.getItem('projectSetupDraft');
            if (savedDraft) {
                setFormData(JSON.parse(savedDraft));
            }
        } catch (e) {
            console.error("Failed to load project setup draft:", e);
        }
    }, []);

    // Auto-save draft to localStorage with debouncing
    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem('projectSetupDraft', JSON.stringify(formData));
        }, 500); // Debounce save by 500ms

        return () => {
            clearTimeout(handler);
        };
    }, [formData]);
    
    // Generic change handler for text inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
        }));
    };

    const handleAddRoom = () => {
        setFormData(prev => ({
            ...prev,
            rooms: [...prev.rooms, { id: uuidv4(), roomName: `Room ${prev.rooms.length + 1}`, roomType: ROOM_TYPES[0] }]
        }));
    };

    const handleRoomChange = (id: string, field: 'roomName' | 'roomType', value: string) => {
        setFormData(prev => ({
            ...prev,
            rooms: prev.rooms.map(r => r.id === id ? { ...r, [field]: value } : r)
        }));
    };

    const handleRemoveRoom = (id: string) => {
        setFormData(prev => ({
            ...prev,
            rooms: prev.rooms.filter(r => r.id !== id)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const setupData: ProjectSetupData = {
            ...formData,
            coverImage: '', // Placeholder
            rooms: formData.rooms.map(({ id, ...rest }) => ({
                ...createDefaultRoomData(),
                ...rest,
                designTier: 'Silver',
                maxParticipants: 10,
                primaryUse: 'General Presentation',
                features: [],
                functionalityStatement: '',
            }))
        };
        onSubmit(setupData);
        localStorage.removeItem('projectSetupDraft');
    };
    
    const handleBack = () => {
        localStorage.removeItem('projectSetupDraft');
        onBack();
    };

    return (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-[#008A3A] mb-2">Create New Project</h2>
            <p className="text-gray-600 mb-6">Enter the basic details for your project. Your progress is saved automatically. You'll configure each room in the next step.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project & Client Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input type="text" id="projectName" name="projectName" value={formData.projectName} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Company Name</label>
                        <input type="text" id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                     <div>
                        <label htmlFor="clientContactName" className="block text-sm font-medium text-gray-700">Client Contact Name</label>
                        <input type="text" id="clientContactName" name="clientContactName" value={formData.clientContactName} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="clientContactEmail" className="block text-sm font-medium text-gray-700">Client Contact Email</label>
                        <input type="email" id="clientContactEmail" name="clientContactEmail" value={formData.clientContactEmail} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Project Address</label>
                        <input type="text" id="clientAddress" name="clientAddress" value={formData.clientAddress} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>

                {/* Rooms Section */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Rooms</h3>
                    <div className="mt-2 space-y-3 p-4 bg-gray-50 border rounded-md">
                        {formData.rooms.map((room) => (
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
                    <button type="button" onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">
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
