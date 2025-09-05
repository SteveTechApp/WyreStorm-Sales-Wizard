import React, { useState } from 'react';
import { ROOM_TYPES } from '../constants';

interface ProjectSetupScreenProps {
  onSubmit: (data: { projectName: string; clientName: string; coverImage: string; rooms: Record<string, number> }) => void;
  onBack: () => void;
  defaultProjectName: string;
}

const ProjectSetupScreen: React.FC<ProjectSetupScreenProps> = ({ onSubmit, onBack, defaultProjectName }) => {
  const [projectName, setProjectName] = useState(defaultProjectName);
  const [clientName, setClientName] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>({});
  
  const handleRoomQuantityChange = (roomType: string, delta: number) => {
    setSelectedRooms(prev => {
      const currentQuantity = prev[roomType] || 0;
      const newQuantity = Math.max(0, currentQuantity + delta);
      const newRooms = { ...prev };
      if (newQuantity > 0) {
        newRooms[roomType] = newQuantity;
      } else {
        delete newRooms[roomType];
      }
      return newRooms;
    });
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
    if (Object.keys(selectedRooms).length === 0) {
      alert("Please select at least one room for your project.");
      return;
    }
    onSubmit({ projectName, clientName, coverImage, rooms: selectedRooms });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#008A3A] mb-2">Start Your New Project</h2>
      <p className="text-gray-600 mb-6">Define the initial scope of your project. You can add, remove, and configure rooms in the next step.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Client Name (Optional)</label>
          <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
      </div>
      
       <div className="mb-8">
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

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Room Templates</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ROOM_TYPES.map(type => (
            <div key={type} className={`p-4 border rounded-lg text-center transition-all duration-200 ${selectedRooms[type] ? 'border-[#008A3A] bg-green-50' : 'border-gray-200'}`}>
              <p className="font-semibold text-base mb-3">{type}</p>
              <div className="flex items-center justify-center gap-2">
                <button type="button" onClick={() => handleRoomQuantityChange(type, -1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">-</button>
                <span className="text-lg font-bold w-10 text-center">{selectedRooms[type] || 0}</span>
                <button type="button" onClick={() => handleRoomQuantityChange(type, 1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button type="button" onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
          Back to Home
        </button>
        <button type="submit" className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
          Create Project
        </button>
      </div>
    </form>
  );
};

export default ProjectSetupScreen;