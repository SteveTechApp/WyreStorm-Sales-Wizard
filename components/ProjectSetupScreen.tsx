
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile, RoomWizardAnswers } from '../types';
import RoomWizard from './RoomWizard';

interface ProjectSetupScreenProps {
  onSubmit: (data: { 
    projectName: string; 
    clientName: string; 
    clientContactName: string;
    clientContactEmail: string;
    clientAddress: string;
    coverImage: string; 
    rooms: { roomType: string; designTier: string, wizardAnswers: RoomWizardAnswers }[] 
  }) => void;
  onBack: () => void;
  defaultProjectName: string;
  userProfile: UserProfile | null;
}

interface RoomInstance {
    id: string;
    name: string;
    roomType: string;
    designTier: string;
    wizardAnswers: RoomWizardAnswers;
}

const PROJECT_SCOPE_OPTIONS = [
  { id: 'custom', label: 'Custom Project', description: 'Start with a blank slate and add rooms one by one.' },
  { id: 'single', label: 'Single Room / POC', description: 'A single, focused space.' },
  { id: 'small', label: 'Small Office (2-5 rooms)', description: 'A typical small business setup.' },
  { id: 'medium', label: 'Medium Office (6-15 rooms)', description: 'Multiple floors or a larger department.' },
  { id: 'large', label: 'Large Campus / Enterprise (>15 rooms)', description: 'Complex, multi-building deployment.' },
];

const SCOPE_ROOM_TEMPLATES: Record<string, {roomType: string, designTier: string, count: number}[]> = {
    'single': [
        { roomType: 'Conference Room', designTier: 'Silver', count: 1 },
    ],
    'small': [
        { roomType: 'Conference Room', designTier: 'Silver', count: 1 },
        { roomType: 'Huddle Room', designTier: 'Bronze', count: 2 },
    ],
    'medium': [
        { roomType: 'Boardroom', designTier: 'Gold', count: 1 },
        { roomType: 'Conference Room', designTier: 'Silver', count: 4 },
        { roomType: 'Huddle Room', designTier: 'Bronze', count: 3 },
    ],
    'large': [
         { roomType: 'Boardroom', designTier: 'Gold', count: 2 },
         { roomType: 'Conference Room', designTier: 'Silver', count: 8 },
         { roomType: 'Huddle Room', designTier: 'Bronze', count: 5 },
         { roomType: 'Briefing Center', designTier: 'Gold', count: 1 },
    ]
};

const ProjectSetupScreen: React.FC<ProjectSetupScreenProps> = ({ onSubmit, onBack, defaultProjectName, userProfile }) => {
  const [projectName, setProjectName] = useState(defaultProjectName);
  const [clientName, setClientName] = useState('');
  const [clientContactName, setClientContactName] = useState('');
  const [clientContactEmail, setClientContactEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [rooms, setRooms] = useState<RoomInstance[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [projectScope, setProjectScope] = useState<string>('custom');

  const handleAddRoom = (answers: RoomWizardAnswers, roomType: string, designTier: string) => {
    const newRoom: RoomInstance = {
      id: uuidv4(),
      name: answers.roomName,
      roomType,
      designTier,
      wizardAnswers: answers,
    };
    setRooms(prev => [...prev, newRoom]);
    setIsWizardOpen(false);
  };
  
  const handleRemoveRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rooms.length === 0) return;
    const roomsToSubmit = rooms.map(({ roomType, designTier, wizardAnswers }) => ({ roomType, designTier, wizardAnswers }));
    onSubmit({ projectName, clientName, clientContactName, clientContactEmail, clientAddress, coverImage, rooms: roomsToSubmit });
  };
  
  const TIER_BADGE_STYLES: Record<string, string> = {
      'Bronze': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Silver': 'bg-gray-200 text-gray-800 border-gray-300',
      'Gold': 'bg-amber-100 text-amber-800 border-amber-300',
  };
  
  const handleApplyScope = () => {
    if (!projectScope || !SCOPE_ROOM_TEMPLATES[projectScope]) return;

    const roomsToCreate = SCOPE_ROOM_TEMPLATES[projectScope];
    const newRooms: RoomInstance[] = [];
    roomsToCreate.forEach(template => {
        for(let i=1; i <= template.count; i++) {
             const roomName = template.count > 1 ? `${template.roomType} ${i}`: template.roomType;
             const defaultWizardAnswers: RoomWizardAnswers = {
                roomName,
                participantCount: template.designTier === 'Bronze' ? 4 : template.designTier === 'Silver' ? 10 : 16,
                primaryUse: 'Video Conferencing',
                displayConfiguration: [{ type: 'Standard Display(s)', quantity: template.designTier === 'Bronze' ? 1 : (template.roomType === 'Boardroom' ? 2 : 1) }],
                features: ['Video Conferencing', 'Wireless Presentation'],
             };
             newRooms.push({
                 id: uuidv4(),
                 name: roomName,
                 roomType: template.roomType,
                 designTier: template.designTier,
                 wizardAnswers: defaultWizardAnswers,
             });
        }
    });
    setRooms(newRooms);
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newScope = e.target.value;
      setProjectScope(newScope);
      if (newScope === 'custom') {
          setRooms([]);
      }
  };


  return (
    <>
      <RoomWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onAdd={handleAddRoom}
      />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#008A3A] mb-2">Build Your Project</h2>
        <p className="text-gray-600 mb-6">Define the project details and add bespoke rooms using the AI-powered Room Wizard.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Client Company Name (Optional)</label>
            <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="clientContactName" className="block text-sm font-medium text-gray-700 mb-1">Client Contact Name (Optional)</label>
            <input type="text" id="clientContactName" value={clientContactName} onChange={e => setClientContactName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
           <div>
            <label htmlFor="clientContactEmail" className="block text-sm font-medium text-gray-700 mb-1">Client Contact Email (Optional)</label>
            <input type="email" id="clientContactEmail" value={clientContactEmail} onChange={e => setClientContactEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        
         <div className="mb-6">
            <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700 mb-1">Client Address (Optional)</label>
            <textarea id="clientAddress" value={clientAddress} onChange={e => setClientAddress(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>

         <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (Optional)</label>
          <div className="mt-1 flex items-center gap-4">
              <div className="w-24 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border">
              {coverImage ? <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Preview</span>}
              </div>
              <label htmlFor="cover-image-upload" className="cursor-pointer text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-md">
              Upload Image
              <input id="cover-image-upload" type="file" onChange={handleCoverImageChange} accept="image/*" className="hidden" />
              </label>
          </div>
        </div>
        
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose a Starting Point</h3>
            <p className="text-sm text-gray-500 mb-4">Start with a blank project or use an AI-suggestion to get a head start.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROJECT_SCOPE_OPTIONS.map(opt => (
                    <label key={opt.id} className="cursor-pointer p-4 border rounded-lg has-[:checked]:bg-green-50 has-[:checked]:border-green-400 has-[:checked]:ring-1 has-[:checked]:ring-green-400">
                        <input type="radio" name="projectScope" value={opt.id} checked={projectScope === opt.id} onChange={handleScopeChange} className="sr-only" />
                        <span className="font-semibold text-gray-800 block">{opt.label}</span>
                        <span className="text-xs text-gray-600">{opt.description}</span>
                    </label>
                ))}
            </div>
            {projectScope && projectScope !== 'custom' && (
                <div className="text-center mt-4 p-3 bg-gray-100 rounded-md animate-fade-in-fast">
                    <button type="button" onClick={handleApplyScope} className="text-sm font-semibold text-[#008A3A] hover:underline">
                        Apply suggested room template for a '{PROJECT_SCOPE_OPTIONS.find(o => o.id === projectScope)?.label}'
                    </button>
                </div>
            )}
        </div>

        <div className="bg-gray-50/50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Project Room List</h3>
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="bg-[#008A3A] hover:bg-[#00732f] text-white text-sm font-bold py-2 px-4 rounded-md transition-colors"
            >
              + Add Room
            </button>
          </div>
          <div className="min-h-[120px]">
            {rooms.length > 0 ? (
              <ul className="space-y-2">
                {rooms.map((room) => (
                  <li key={room.id} className="flex items-center justify-between text-sm bg-white p-3 rounded border animate-fade-in-fast">
                    <div>
                      <span className="font-semibold text-gray-800">{room.name}</span>
                      <span className="text-gray-500 ml-2">({room.roomType})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-xs px-2 py-1 rounded-full border ${TIER_BADGE_STYLES[room.designTier]}`}>{room.designTier}</span>
                      <button type="button" onClick={() => handleRemoveRoom(room.id)} className="text-red-500 hover:text-red-700 text-xs ml-2 p-1 font-bold" title="Remove Room">&#10005;</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>
                    {projectScope === 'custom'
                        ? 'Your custom project is empty. Click "+ Add Room" to begin.'
                        : 'Your project is empty. Apply a scope template or click "+ Add Room".'
                    }
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button type="button" onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
            Back to Home
          </button>
          <button 
            type="submit" 
            disabled={rooms.length === 0}
            className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Project
          </button>
        </div>
      </form>
    </>
  );
};

export default ProjectSetupScreen;
