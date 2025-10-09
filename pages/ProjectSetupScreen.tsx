import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerationContext } from '../context/GenerationContext.tsx';
import { useUserContext } from '../context/UserContext.tsx';
import { ProjectSetupData, RoomData, DesignTier } from '../utils/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { ROOM_TYPES, DESIGN_TIER_OPTIONS } from '../data/constants.ts';
import { PlusIcon } from '../components/Icons.tsx';
import { createNewRoom } from '../utils/utils.ts';

const ProjectSetupScreen: React.FC = () => {
    const [projectName, setProjectName] = useState('New Sortie');
    const [clientName, setClientName] = useState('New Client');
    const [budget, setBudget] = useState<number | undefined>();
    const [timeline, setTimeline] = useState('');
    const [rooms, setRooms] = useState<Omit<RoomData, 'id'>[]>([]);
    const { handleProjectSetupSubmit } = useGenerationContext();
    const { userProfile } = useUserContext();
    const navigate = useNavigate();

    const handleAddRoom = () => {
        const newRoomBase = createNewRoom();
        const newRoom: Omit<RoomData, 'id'> = {
            ...newRoomBase,
            roomName: `Target Area ${rooms.length + 1}`,
            roomType: 'Conference Room',
            designTier: 'Silver',
        };
        setRooms([...rooms, newRoom]);
    };

    const handleRoomChange = (index: number, field: keyof Omit<RoomData, 'id'>, value: any) => {
        const newRooms = [...rooms];
        (newRooms[index] as any)[field] = value;
        setRooms(newRooms);
    };

    const handleRemoveRoom = (index: number) => {
        setRooms(rooms.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const setupData: ProjectSetupData = { projectName, clientName, rooms, budget, timeline };
        handleProjectSetupSubmit(setupData, navigate);
    };

    const inputStyle = "w-full p-2 border-2 border-border rounded-none bg-input-bg mt-1 focus:border-accent outline-none";

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-accent mb-2 uppercase tracking-widest">Plan New Sortie</h1>
                <p className="text-lg text-text-secondary">Define mission parameters and target areas for your new project.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mfd-panel">
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">// Mission Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="project-name" className="block text-sm font-medium uppercase">Sortie Name</label>
                            <input type="text" id="project-name" value={projectName} onChange={e => setProjectName(e.target.value)} className={inputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="client-name" className="block text-sm font-medium uppercase">Client</label>
                            <input type="text" id="client-name" value={clientName} onChange={e => setClientName(e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium uppercase">Mission Budget ({userProfile.currency})</label>
                            <input type="number" id="budget" value={budget || ''} placeholder="e.g., 25000" onChange={e => setBudget(Number(e.target.value))} className={inputStyle} />
                        </div>
                        <div>
                             <label htmlFor="timeline" className="block text-sm font-medium uppercase">Target Completion Date</label>
                            <input type="date" id="timeline" value={timeline} onChange={e => setTimeline(e.target.value)} className={inputStyle} />
                        </div>
                    </div>
                </div>

                <div className="mfd-panel">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold uppercase tracking-widest">// Target Areas</h2>
                        <button type="button" onClick={handleAddRoom} className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                            <PlusIcon className="h-4 w-4" /> Add Area
                        </button>
                    </div>
                    <div className="space-y-4">
                        {rooms.map((room, index) => (
                           <div key={index} className="p-4 border-2 border-border bg-background">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-lg">Target Area {index + 1}</h3>
                                    <button type="button" onClick={() => handleRemoveRoom(index)} className="text-sm text-destructive hover:underline">Remove</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input placeholder="Area Name" type="text" value={room.roomName} onChange={e => handleRoomChange(index, 'roomName', e.target.value)} className={inputStyle} />
                                    <select value={room.roomType} onChange={e => handleRoomChange(index, 'roomType', e.target.value)} className={inputStyle}>
                                        {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                    <select value={room.designTier} onChange={e => handleRoomChange(index, 'designTier', e.target.value as DesignTier)} className={inputStyle}>
                                        {DESIGN_TIER_OPTIONS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                                    </select>
                                </div>
                            </div>
                        ))}
                         {rooms.length === 0 && <p className="text-center text-sm text-text-secondary py-4">// No target areas defined. Click 'Add Area' to get started.</p>}
                    </div>
                </div>

                <div className="text-right">
                    <button type="submit" className="btn btn-primary text-lg">
                        Launch Sortie
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectSetupScreen;